pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
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
    address public SUDOSWAP_CONTRACT;

    address public VAULT_MANAGER;
    address public VAULT_CREATOR;

    bool public external_lp_enabled;

    address[] public collections;
    uint256[] public ltvs;
    
    uint256 apr;
    uint256 expirityDate;

    uint32 public constant LIQUIDITY = 0;
    uint256 public totalSupply = 0;

    modifier onlyVaultManager {
        require (msg.sender == VAULT_MANAGER);
        _;
    }

    modifier checkExpired {
        require(block.timestamp < expirityDate);
        _;
    }

    constructor(string memory _VAULT_NAME, address _VAULT_MANAGER,  uint256 _expirityDate, address[] memory _collections, uint256[] memory _ltvs, uint256 _apr, bool _external_lp_enabled) ERC1155("https://example.com"){

        require(_collections.length == _ltvs.length);

        VAULT_NAME = _VAULT_NAME;
        VAULT_MANAGER = _VAULT_MANAGER;
        expirityDate = _expirityDate;
        external_lp_enabled = _external_lp_enabled;
        collections = _collections;
        ltvs = _ltvs;
        apr = _apr;
        VAULT_CREATOR = address(this);
        

        setContracts();
    }

    function setContracts() public {
        (address _WETH, address _NFTFI_CONTRACT, address _NFTFI_COORDINATOR, address _NFTFI_TOKEN, address _SUDOSWAP_CONTRACT) = IVaultManager(VAULT_MANAGER).getContractAddresses();
        WETH = _WETH;
        NFTFI_CONTRACT = _NFTFI_CONTRACT;
        NFTFI_COORDINATOR = _NFTFI_COORDINATOR;
        NFTFI_TOKEN = _NFTFI_TOKEN;
        SUDOSWAP_CONTRACT = _SUDOSWAP_CONTRACT;
    }

    function getWETHBalance() public returns (uint256) {
        //need to add expectation of current loans too
        return IERC20(WETH).balanceOf(address(this));
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

        _mint(msg.sender, LIQUIDITY, shares, "");
        totalSupply = totalSupply + shares;
    }

    function takeLoan(uint32 loanId) public nonReentrant checkExpired {
        
        // (uint256 loanPrincipalAmount, uint256 maximumRepaymentAmount, uint256 nftCollateralId, address loanERC20Denomination, uint32 loanDuration, uint16 loanInterestRateForDurationInBasisPoints, uint16 loanAdminFeeInBasisPoints, address nftCollateralWrapper, uint64 loanStartTime, address nftCollateralContract, address borrower) = IDirectLoanBase(NFTFI_TOKEN).loanIdToLoan(loanId);
        // console.log(loanPrincipalAmount);
        // console.log(maximumRepaymentAmount);

    }

    function sellLiquidations() public nonReentrant {

    }



    function withdrawLiquidity(uint256 _amount) public nonReentrant {
        require(block.timestamp > expirityDate);
    }



}