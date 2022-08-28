pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
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
    address private WETH;
    address private NFTFI_CONTRACT;
    address private NFTFI_COORDINATOR;

    address private NFTFI_TOKEN;
    address private ORACLE_CONTRACT;
    address private AUCTION_CONTRACT;
    address private UTILS_CONTRACT;

    string public VAULT_NAME;
    address private VAULT_MANAGER;
    address private VAULT_ADMIN;

    bool private external_lp_enabled;

    uint256[] public all_loans; //all loans taken from our vault

    address[] private collections;
    uint32[] private ltvs;
    uint32[] private aprs;

    uint256 public expirityDate;

    uint32 private constant LIQUIDITY = 0;
    /// The ID of the next token that will be minted. Skips 0
    uint256 private _nextId = 1;

    uint256 public totalSupply = 0;

    modifier onlyVaultAdmin {
        require (msg.sender == VAULT_ADMIN);
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

    constructor() ERC1155("https://example.com"){

    }

    function initialize(string memory _VAULT_NAME, address _VAULT_MANAGER, address _VAULT_ADMIN, uint256 _expirityDate, address[] memory _collections, uint32[] memory _ltvs, uint32[] memory _aprs, bool _external_lp_enabled) external{
        if (VAULT_ADMIN != address(0)) {revert();}

        if((_collections.length != _ltvs.length) ||  _collections.length != _aprs.length) {revert();}

        VAULT_NAME = _VAULT_NAME;
        VAULT_MANAGER = _VAULT_MANAGER;
        VAULT_ADMIN = _VAULT_ADMIN;
        expirityDate = _expirityDate;
        external_lp_enabled = _external_lp_enabled;
        collections = _collections;
        ltvs = _ltvs;
        aprs = _aprs;

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

    //This function is purely for testing purpose and should be removed from mainnet deployment
    function expireVault() onlyVaultAdmin external {
        expirityDate = block.timestamp - 1;
    }

    function getVaultDetails() public view returns (address[] memory, uint32[] memory, uint32[] memory){
        return (collections, ltvs, aprs);
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

    function getCollateralDetails(address nftCollateralContract) internal view returns (address, uint256, uint256)  {


        for (uint i=0; i<collections.length; i++) {
            if (collections[i] == nftCollateralContract){
                return (collections[i], ltvs[i], aprs[i]);
            }
        }

        revert();
    }


    function addLiquidity(uint256 _amount)  external checkExpired {

        if (external_lp_enabled == false){
            if (msg.sender != VAULT_MANAGER) {revert();}
        }

        uint256 shares = _amount;

        if (totalSupply > 0) {
            shares =  _amount * (totalSupply / getWETHBalance());
        }

        (bool success, ) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, this, _amount));
        
        if (success == false) {revert();}

        _mint(msg.sender, LIQUIDITY, shares, ""); //0 is liquidity token
        totalSupply = totalSupply + shares;
    }

    function _createLoan(VaultLib.loanCreation memory new_loan) private returns (uint256){
        
        if(new_loan.loanExpirty < block.timestamp) {revert();}
        if(IERC20(WETH).balanceOf(address(this)) < new_loan.loanPrincipal) {revert();}

        (bool success, ) = WETH.call(abi.encodeWithSelector(0x23b872dd, address(this), msg.sender, new_loan.loanPrincipal));
        if (success == false) {revert();}

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

    function takePNNFILoan(uint32 _loanId, uint256 _loanAmount, uint256 _repaymentDate) external nonReentrant checkExpired returns (uint256) {

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

    function takeERC721Loan(address nftCollateralContract, uint256 nftCollateralId, uint256 _loanAmount, uint256 _repaymentDate) external nonReentrant checkExpired returns (uint256){
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

    function repayLoan(uint32 _loanId) external {
        //make this an array so multiple loans at once?
        VaultLib.loanDetails storage curr_loan = _loans[_loanId];

        if(curr_loan.expirity < block.timestamp) {revert();}
        
        (bool success, ) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), curr_loan.repaymentAmount));
        require(success, "F");

        if (curr_loan.smartNftId != 0){
            IERC721(NFTFI_TOKEN).transferFrom(address(this), msg.sender,  curr_loan.smartNftId); //Transfer the NFT from our wallet to user
        }else {
            IERC721(curr_loan.collateral).transferFrom(address(this), msg.sender,  curr_loan.assetId); //Transfer the NFT from our wallet to user
        }

        delete _loans[_loanId];


        _burn(msg.sender, _loanId, 1);
    }

    function createAuction(uint256 _loanId) external {
        VaultLib.loanDetails storage curr_loan = _loans[_loanId];

        if ((curr_loan.underlyingExpirity >= block.timestamp) || (curr_loan.expirity >= block.timestamp)) {revert();}

        if ((curr_loan.smartNftId) != 0) {
            IDirectLoanBase(NFTFI_CONTRACT).liquidateOverdueLoan(curr_loan.nftfiLoanId);
        }

        IPepeAuction(AUCTION_CONTRACT).createAuction(_loanId, curr_loan.collateral, curr_loan.assetId, Math.min(curr_loan.repaymentAmount, IPepeFiOracle(ORACLE_CONTRACT).getPrice(curr_loan.collateral)), 7200,  20, address(this), msg.sender,  5);

    }

    function finishedAuction(uint256 _loanId) external onlyAuction {
        delete _loans[_loanId];
        _burn(msg.sender, _loanId, 1);
    }

    function withdrawLiquidity(uint256 shares) external nonReentrant {
        if(block.timestamp <= expirityDate) {revert();}

        uint256 balance = this.balanceOf(msg.sender, LIQUIDITY);

        if (balance <= shares) {revert();}

        uint256 amount = shares * getWETHBalance() / totalSupply;
        
        if(IERC20(WETH).balanceOf(address(this)) < amount) {revert();}
        (bool success, ) = WETH.call(abi.encodeWithSelector(0x23b872dd, this, msg.sender, amount));

        if (success){
            totalSupply = totalSupply - shares;
            _burn(msg.sender, LIQUIDITY, shares);
        }

    }

}