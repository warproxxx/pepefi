pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "./interfaces/IERC20.sol";
import "./interfaces/IDirectLoanBase.sol";
import "./interfaces/IVaultManager.sol";
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

    uint128[] public all_loans; //all loans taken from our vault

    address[] public collections;
    uint128[] public ltvs;
    uint128[] public aprs;

    uint128 expirityDate;

    uint32 public constant LIQUIDITY = 0;
    /// The ID of the next token that will be minted. Skips 0
    uint128 private _nextId = 1;

    uint128 public totalSupply = 0;

    modifier onlyVaultManager {
        require (msg.sender == VAULT_MANAGER);
        _;
    }

    modifier checkExpired {
        require(block.timestamp < expirityDate);
        _;
    }

    struct loanDetails {
        uint128 timestamp; //unix timestamp of when the bet was made
        uint128 expirity; //expirity date of loan
        uint8 loanType; //0 for PN. 1 for nft
        uint128 loanPrincipalAmount; //principal taken
        uint128 repaymentAmount; //repayment amount
    }

    struct assetDetails {
        address collection;
        uint128 ltv;
        uint128 apr;
    }

    mapping(uint128 => loanDetails) public _loans;

    constructor(string memory _VAULT_NAME, address _VAULT_MANAGER,  uint128 _expirityDate, address[] memory _collections, uint128[] memory _ltvs, uint128[] memory _aprs, bool _external_lp_enabled) ERC1155("https://example.com"){

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

    function getAllLoans() public view returns (uint128[] memory){
        return all_loans;
    }

    function getWETHBalance() public returns (uint128) {
        //need to add expectation of current loans too
        return IERC20(WETH).balanceOf(address(this));
    }

    function addLiquidity(uint128 _amount)  public nonReentrant checkExpired {

        uint128 shares = 0;

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

    function takePNNFILoan(uint32 loanId) public nonReentrant checkExpired returns (uint128) {
        //make this an array so multiple loans at once?

        IDirectLoanCoordinator.Loan memory loan = IDirectLoanCoordinator(NFTFI_COORDINATOR).getLoanData(loanId);
        require(loan.status == IDirectLoanCoordinator.StatusType.NEW, "It needs to be an active loan");

        // IERC721(NFTFI_TOKEN).transferFrom(msg.sender, address(this), loan.smartNftId); //Transfer the NFT to our wallet. Commenting out is as it messes the flow of test unless repaid too

        (uint128 loanPrincipalAmount, uint128 maximumRepaymentAmount, , address loanERC20Denomination, uint32 loanDuration, uint16 loanInterestRateForDurationInBasisPoints, , , uint64 loanStartTime, address nftCollateralContract, ) = IDirectLoanBase(NFTFI_CONTRACT).loanIdToLoan(loanId);
        
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


        _loans[_nextId+1] = loanDetails({
                timestamp: block.timestamp,
                expirity: Math.min(loanStartTime + loanDuration,  expirityDate),
                loanType: 0,
                loanPrincipalAmount: loanPrincipalAmount, //just testing. this should be based on ltv
                repaymentAmount: maximumRepaymentAmount //this should be based on our APR
            });


        all_loans.push(_nextId+1);

        _mint(msg.sender, _nextId+1, 1, "");
        _nextId++;
        
        return _nextId;
    }

    function repayLoan(uint32 loanId) public nonReentrant {
        //make this an array so multiple loans at once?

        loanDetails storage curr_loan = _loans[loanId];


        (bool success, bytes memory data) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), curr_loan.repaymentAmount));
        require(success, "Cannot transfer WETH");

        delete _loans[loanId];
        _burn(msg.sender, loanId, 1);
    }

    function takeERC721Loan() public nonReentrant checkExpired{
        
    }

    function sellLiquidations() public nonReentrant {

    }



    function withdrawLiquidity(uint128 _amount) public nonReentrant {
        require(block.timestamp > expirityDate); //require liquidations are sold too. or maybe not
    }



}