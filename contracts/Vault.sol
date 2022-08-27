pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "./interfaces/IERC20.sol";
import "./interfaces/IDirectLoanBase.sol";
import "./interfaces/IVaultManager.sol";
import "./interfaces/IPepeFiOracle.sol";
import "./interfaces/IPepeAuction.sol";
import "./interfaces/IVaultUtils.sol";

import {VaultLib} from './VaultLib.sol';


contract Vault is ERC1155, ReentrancyGuard{
    string public VAULT_NAME;

    address public WETH;
    address public NFTFI_CONTRACT;
    address public NFTFI_COORDINATOR;

    address public NFTFI_TOKEN;
    address public ORACLE_CONTRACT;
    address public AUCTION_CONTRACT;
    address public UTILS_CONTRACT;

    address public VAULT_MANAGER;

    bool public external_lp_enabled;

    uint256[] public all_loans; //all loans taken from our vault

    address[] public collections;
    uint32[] public ltvs;
    uint32[] public aprs;

    uint256 expirityDate;

    uint32 public constant LIQUIDITY = 0;
    /// The ID of the next token that will be minted. Skips 0
    uint256 private _nextId = 1;

    uint256 public totalSupply = 0;

    modifier onlyVaultManager {
        require (msg.sender == VAULT_MANAGER);
        _;
    }

    modifier onlyAuction {
        require (msg.sender == AUCTION_CONTRACT);
        _;
    }

    modifier checkExpired {
        require(block.timestamp < expirityDate);
        _;
    }

    

    mapping(uint256 => VaultLib.loanDetails) public _loans;

    constructor(string memory _VAULT_NAME, address _VAULT_MANAGER,  uint256 _expirityDate, address[] memory _collections, uint32[] memory _ltvs, uint32[] memory _aprs, bool _external_lp_enabled) ERC1155("https://example.com"){

        require(_collections.length == _ltvs.length );
        require(_collections.length == _aprs.length );

        VAULT_NAME = _VAULT_NAME;
        VAULT_MANAGER = _VAULT_MANAGER;
        expirityDate = _expirityDate;
        external_lp_enabled = _external_lp_enabled;
        collections = _collections;
        ltvs = _ltvs;
        aprs = _aprs;
        

        setContracts();
    }

    function setContracts() public {
        (address _WETH, address _NFTFI_CONTRACT, address _NFTFI_COORDINATOR, address _NFTFI_TOKEN, address _ORACLE_CONTRACT, address _AUCTION_CONTRACT, address _UTILS_CONTRACT) = IVaultManager(VAULT_MANAGER).getContractAddresses();
        WETH = _WETH;
        NFTFI_CONTRACT = _NFTFI_CONTRACT;
        NFTFI_COORDINATOR = _NFTFI_COORDINATOR;
        NFTFI_TOKEN = _NFTFI_TOKEN;
        ORACLE_CONTRACT = _ORACLE_CONTRACT;
        AUCTION_CONTRACT = _AUCTION_CONTRACT;
        UTILS_CONTRACT = _UTILS_CONTRACT;
    }

    function getAllLoans() public view returns (uint256[] memory){
        return all_loans;
    }

    function getLoanDetails(uint256 _loanId) public view returns (VaultLib.loanDetails memory){
        return _loans[_loanId];
    }

    function getWETHBalance() public view returns (uint256) {
        uint256 loanBalance = 0;

        //this loop thru active loans and liquidated assets. 2 birds 1 stone.
        for (uint i=0; i<all_loans.length; i++) {
            VaultLib.loanDetails memory details = _loans[all_loans[i]];
            
            uint256 oraclePrice = IPepeFiOracle(ORACLE_CONTRACT).getPrice(details.collateral);

            if (oraclePrice < details.repaymentAmount){
                loanBalance = loanBalance + oraclePrice;
            } else {
                loanBalance = loanBalance + details.loanPrincipalAmount;
            }
        }

        return IERC20(WETH).balanceOf(address(this)) + loanBalance;
    }

    function getCollateralDetails(address nftCollateralContract) internal returns (address, uint256, uint256) {


        for (uint i=0; i<collections.length; i++) {
            if (collections[i] == nftCollateralContract){
                return (collections[i], ltvs[i], aprs[i]);
            }
        }

        revert();
    }


    function addLiquidity(uint256 _amount)  public checkExpired {

        if (external_lp_enabled == false){
            require (msg.sender == VAULT_MANAGER);
        }

        uint256 shares = _amount;

        if (totalSupply > 0) {
            shares =  _amount * (totalSupply / getWETHBalance());
        }

        (bool success, ) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, this, _amount));
        require(success, "F");

        _mint(msg.sender, LIQUIDITY, shares, ""); //0 is liquidity token
        totalSupply = totalSupply + shares;
    }

    function _createLoan(VaultLib.loanCreation memory new_loan) private returns (uint256){
        
        require(new_loan.loanExpirty >= block.timestamp, "fut");
        require(IERC20(WETH).balanceOf(address(this)) >= new_loan.loanPrincipal, "blc");

        (bool success, ) = WETH.call(abi.encodeWithSelector(0x23b872dd, address(this), msg.sender, new_loan.loanPrincipal));
        require(success, "F");

        if (new_loan.smartNftId == 0){
            IERC721(new_loan.nftCollateralContract).transferFrom(msg.sender, address(this), new_loan.nftCollateralId); //Transfer the NFT to our wallet. 
        }
        else {
            IERC721(NFTFI_TOKEN).transferFrom(msg.sender, address(this), new_loan.smartNftId); //Transfer the NFT to our wallet. 
        }

        _loans[_nextId+1] = VaultLib.loanDetails({
                timestamp: block.timestamp,
                collateral: new_loan.nftCollateralContract,
                assetId: new_loan.nftCollateralId,
                smartNftId: new_loan.smartNftId,
                nftfiLoanId: new_loan.nftfiLoanId,
                expirity: new_loan.loanExpirty,
                underlyingExpirity: new_loan.underlyingExpirity,
                loanPrincipalAmount: new_loan.loanPrincipal, 
                repaymentAmount: (((new_loan.loanExpirty-block.timestamp) * new_loan.apr * new_loan.loanPrincipal))/31536000000 + new_loan.loanPrincipal
            });

        all_loans.push(_nextId+1);

        _mint(msg.sender, _nextId+1, 1, "");
        _nextId++;
        
        return _nextId;
    }

    function takePNNFILoan(uint32 _loanId, uint256 _loanAmount, uint256 _repaymentDate) public nonReentrant checkExpired returns (uint256) {

        (uint256 smartNftId, address nftCollateralContract, uint256 nftCollateralId, uint64 underlyingExpirity) = IVaultUtils(UTILS_CONTRACT)._preprocessPNNFTFi(_loanId, _loanAmount);

        (address collection, uint256 ltv, uint256 apr) = getCollateralDetails(nftCollateralContract);

        //using struct as 20 variable limit
        return _createLoan(VaultLib.loanCreation({
            nftCollateralContract: nftCollateralContract, 
            nftCollateralId: nftCollateralId, 
            loanPrincipal: Math.min(_loanAmount, ltv * IPepeFiOracle(ORACLE_CONTRACT).getPrice(collection)), 
            apr: apr, 
            loanExpirty: Math.min(Math.min(underlyingExpirity,  expirityDate), _repaymentDate), 
            smartNftId: smartNftId, 
            nftfiLoanId: _loanId, 
            underlyingExpirity: underlyingExpirity
        })); 
    }

    function takeERC721Loan(address nftCollateralContract, uint256 nftCollateralId, uint256 _loanAmount, uint256 _repaymentDate) public nonReentrant checkExpired returns (uint256){
        // using nftfi as settlement layer later. Not doing that is better choice for hackathon

        (address collection, uint256 ltv, uint256 apr) = getCollateralDetails(nftCollateralContract);

        return _createLoan(VaultLib.loanCreation({
            nftCollateralContract: nftCollateralContract, 
            nftCollateralId: nftCollateralId, 
            loanPrincipal: Math.min(_loanAmount, ltv * IPepeFiOracle(ORACLE_CONTRACT).getPrice(collection)), 
            apr: apr, 
            loanExpirty: Math.min(_repaymentDate,  expirityDate), 
            smartNftId: 0, 
            nftfiLoanId: 0, 
            underlyingExpirity: 0
        })); 

    }

    function getIndex(uint256 value) public view returns (uint256){

        for (uint i=0; i<all_loans.length; i++) {
            if (all_loans[i] == value){
                return i;
            }
        }

        revert();
    }

    function repayLoan(uint32 _loanId) public {
        //make this an array so multiple loans at once?
        VaultLib.loanDetails storage curr_loan = _loans[_loanId];

        uint256 _loanIndex = getIndex(_loanId);

        require(curr_loan.expirity >= block.timestamp, "Exp");
        
        (bool success, bytes memory data) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), curr_loan.repaymentAmount));
        require(success, "F");

        if (curr_loan.smartNftId != 0){
            IERC721(NFTFI_TOKEN).transferFrom(address(this), msg.sender,  curr_loan.smartNftId); //Transfer the NFT from our wallet to user
        }else {
            IERC721(curr_loan.collateral).transferFrom(address(this), msg.sender,  curr_loan.assetId); //Transfer the NFT from our wallet to user
        }

        delete _loans[_loanId];
        delete all_loans[_loanIndex];


        _burn(msg.sender, _loanId, 1);
    }

    function createAuction(uint256 _loanId) public {
        VaultLib.loanDetails storage curr_loan = _loans[_loanId];
        require(curr_loan.underlyingExpirity < block.timestamp, "Exp");
        require(curr_loan.expirity < block.timestamp, "Exp");

        if ((curr_loan.smartNftId) != 0) {
            IDirectLoanBase(NFTFI_CONTRACT).liquidateOverdueLoan(curr_loan.nftfiLoanId);
        }

        IPepeAuction(AUCTION_CONTRACT).createAuction(_loanId, Math.min(curr_loan.repaymentAmount, IPepeFiOracle(ORACLE_CONTRACT).getPrice(curr_loan.collateral)), 980, curr_loan.collateral, curr_loan.assetId, 172800, msg.sender, address(this), 5 );

    }

    function finishedAuction(uint256 _loanId) public onlyAuction {
        delete _loans[_loanId];
        uint256 _loanIndex = getIndex(_loanId);        
        delete all_loans[_loanIndex];
        _burn(msg.sender, _loanId, 1);
    }

    function withdrawLiquidity(uint256 shares) public nonReentrant {
        require(block.timestamp > expirityDate); 

        uint256 balance = this.balanceOf(msg.sender, LIQUIDITY);
        require(balance >= shares, "G");

        uint256 amount = shares * getWETHBalance() / totalSupply;
        
        require(IERC20(WETH).balanceOf(address(this)) >= amount, "F");
        (bool success, bytes memory data) = WETH.call(abi.encodeWithSelector(0x23b872dd, this, msg.sender, amount));

        if (success){
            totalSupply = totalSupply - shares;
            _burn(msg.sender, LIQUIDITY, shares);
        }

    }

}