pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "./interfaces/IERC20.sol";
import "./interfaces/IDirectLoanBase.sol";
import "./interfaces/IVaultManager.sol";
import "./interfaces/IPepeFiOracle.sol";
import "./interfaces/IDirectLoanCoordinator.sol";


import "hardhat/console.sol";

contract Vault is ERC1155, ReentrancyGuard{
    string public VAULT_NAME;

    address public WETH;
    address public NFTFI_CONTRACT;
    address public NFTFI_COORDINATOR;

    address public NFTFI_TOKEN;
    address public ORACLE_CONTRACT;

    address public VAULT_MANAGER;
    address public VAULT_CREATOR;

    bool public external_lp_enabled;

    uint256[] public all_loans; //all loans taken from our vault

    address[] public collections;
    uint256[] public ltvs;
    uint256[] public aprs;

    uint256 expirityDate;

    uint32 public constant LIQUIDITY = 0;
    /// The ID of the next token that will be minted. Skips 0
    uint256 private _nextId = 1;

    uint256 public totalSupply = 0;

    modifier onlyVaultManager {
        require (msg.sender == VAULT_MANAGER);
        _;
    }

    modifier checkExpired {
        require(block.timestamp < expirityDate);
        _;
    }

    struct loanDetails {
        uint256 timestamp; //unix timestamp of when the bet was made

        address collateral; //collaret nft
        uint256 assetId; //asset ID

        uint256 smartNftId; //incase it is nftfi loan

        uint256 expirity; //expirity date of loan
        uint8 loanType; //0 for PN. 1 for nft
        uint256 loanPrincipalAmount; //principal taken
        uint256 repaymentAmount; //repayment amount
    }

    struct assetDetails {
        address collection;
        uint256 ltv;
        uint256 apr;
    }

    mapping(uint256 => loanDetails) public _loans;

    constructor(string memory _VAULT_NAME, address _VAULT_MANAGER,  uint256 _expirityDate, address[] memory _collections, uint256[] memory _ltvs, uint256[] memory _aprs, bool _external_lp_enabled) ERC1155("https://example.com"){

        require(_collections.length == _ltvs.length );
        require(_collections.length == _aprs.length );

        VAULT_NAME = _VAULT_NAME;
        VAULT_MANAGER = _VAULT_MANAGER;
        expirityDate = _expirityDate;
        external_lp_enabled = _external_lp_enabled;
        collections = _collections;
        ltvs = _ltvs;
        aprs = _aprs;
        VAULT_CREATOR = address(this);
        

        setContracts();
    }

    function setContracts() public {
        (address _WETH, address _NFTFI_CONTRACT, address _NFTFI_COORDINATOR, address _NFTFI_TOKEN, address _ORACLE_CONTRACT) = IVaultManager(VAULT_MANAGER).getContractAddresses();
        WETH = _WETH;
        NFTFI_CONTRACT = _NFTFI_CONTRACT;
        NFTFI_COORDINATOR = _NFTFI_COORDINATOR;
        NFTFI_TOKEN = _NFTFI_TOKEN;
        ORACLE_CONTRACT = _ORACLE_CONTRACT;
    }

    function getAllLoans() public view returns (uint256[] memory){
        return all_loans;
    }

    function getLoanDetails(uint256 _loanId) public view returns (loanDetails memory){
        return _loans[_loanId];
    }

    function getWETHBalance() public view returns (uint256) {
        uint256 wethBalance = IERC20(WETH).balanceOf(address(this));

        uint256 loanBalance = 0;

        //this loop thru active loans and liquidated assets. 2 birds 1 stone.
        for (uint i=0; i<all_loans.length; i++) {
            loanDetails memory details = _loans[i];
            
            uint256 oraclePrice = IPepeFiOracle(ORACLE_CONTRACT).getPrice(details.collateral);

            if (oraclePrice < details.repaymentAmount){
                loanBalance = loanBalance + oraclePrice;
            } else {
                loanBalance = loanBalance + details.loanPrincipalAmount;
            }
        }

        return wethBalance;
    }

    function addLiquidity(uint256 _amount)  public nonReentrant checkExpired {
        uint256 shares = 0;

        if (totalSupply > 0) {
            shares =  _amount * (totalSupply / getWETHBalance());
        }
        else {
            shares = _amount;
        }

        (bool success, bytes memory data) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, this, _amount));

        require(success, "Failed to send WETH");

        _mint(msg.sender, LIQUIDITY, shares, ""); //0 is liquidity token
        totalSupply = totalSupply + shares;
    }

    function takePNNFILoan(uint32 _loanId, uint256 _loanAmount, uint256 _repaymentDate) public nonReentrant checkExpired returns (uint256) {
        //make this an array so multiple loans at once?

        IDirectLoanCoordinator.Loan memory loan = IDirectLoanCoordinator(NFTFI_COORDINATOR).getLoanData(_loanId);
        require(loan.status == IDirectLoanCoordinator.StatusType.NEW, "It needs to be an active loan");

        IERC721(NFTFI_TOKEN).transferFrom(msg.sender, address(this), loan.smartNftId); //Transfer the NFT to our wallet. 

        (uint256 loanPrincipalAmount, uint256 maximumRepaymentAmount, uint256 nftCollateralId, address loanERC20Denomination, uint32 loanDuration, uint16 loanInterestRateForDurationInBasisPoints, , , uint64 loanStartTime, address nftCollateralContract, ) = IDirectLoanBase(NFTFI_CONTRACT).loanIdToLoan(_loanId);
        
        require(loanERC20Denomination == 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, "The Loan must be in WETH");

        assetDetails memory details;

        for (uint i=0; i<collections.length; i++) {
            if (collections[i] == nftCollateralContract){
                details.collection = collections[i];
                details.ltv = ltvs[i];
                details.apr = aprs[i];
            }
        }

        require(details.ltv != 0, "Collection not in whitelist");

        uint256 loanPrincipal = Math.min(_loanAmount, details.ltv * IPepeFiOracle(ORACLE_CONTRACT).getPrice(details.collection));
        uint256 loanExpirty = Math.min(Math.min(loanStartTime + loanDuration,  expirityDate), _repaymentDate);
       
        require(loanExpirty > block.timestamp, "Loans can only expire in future");

        uint256 repaymentAmount = (((loanExpirty-block.timestamp) * details.apr * loanPrincipal))/31536000000 + loanPrincipal;
        _loans[_nextId+1] = loanDetails({
                timestamp: block.timestamp,
                collateral: nftCollateralContract,
                assetId: nftCollateralId,
                smartNftId: loan.smartNftId,
                expirity: loanExpirty,
                loanType: 0,
                loanPrincipalAmount: loanPrincipal, 
                repaymentAmount: repaymentAmount
            });


        all_loans.push(_nextId+1);

        _mint(msg.sender, _nextId+1, 1, "");
        _nextId++;
        
        return _nextId;
    }

    function repayLoan(uint32 _loanId, uint256 _loanIndex) public nonReentrant {
        //make this an array so multiple loans at once?
        loanDetails storage curr_loan = _loans[_loanId];

        require(all_loans[_loanIndex] == _loanId, "Data modified");
        require(curr_loan.expirity >= block.timestamp, "Repayment duration expired");
        
        (bool success, bytes memory data) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), curr_loan.repaymentAmount));
        require(success, "Cannot transfer WETH");

        IERC721(NFTFI_TOKEN).transferFrom(address(this), msg.sender,  curr_loan.smartNftId); //Transfer the NFT from our wallet to user

        delete _loans[_loanId];
        delete all_loans[_loanIndex];
        _burn(msg.sender, _loanId, 1);
    }

    function takeERC721Loan() public nonReentrant checkExpired{

    }

    function sellLiquidations(uint256 _loanId, uint256 _loanIndex) public nonReentrant {
        loanDetails storage curr_loan = _loans[_loanId];
        require(all_loans[_loanIndex] == _loanId, "Data modified");
        require(curr_loan.expirity < block.timestamp, "Loan must expire");
        
        //selling logic here

        delete _loans[_loanId];
        delete all_loans[_loanIndex];
        _burn(msg.sender, _loanId, 1);

    }



    function withdrawLiquidity(uint256 _amount) public nonReentrant {
        require(block.timestamp > expirityDate); //require liquidations are sold too. or maybe not
    }



}