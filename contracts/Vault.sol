pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Vault is ERC1155, ReentrancyGuard{
    string public VAULT_NAME;
    address public WETH;
    bool public external_lp_enabled;
    address public VAULT_MANAGER;
    address public VAULT_CREATOR;
    address[] public collections;
    uint256[] public ltvs;
    uint256 initialAPR;

    modifier onlyVaultManager {
        require (msg.sender == VAULT_MANAGER);
        _;
    }

    constructor(string memory _VAULT_NAME, address _WETH, address _VAULT_MANAGER, address[] memory _collections, uint256[] memory _ltvs, uint256 _initialAPR, bool _external_lp_enabled) ERC1155("https://example.com"){

        require(_collections.length == _ltvs.length);

        VAULT_NAME = _VAULT_NAME;
        WETH = _WETH;
        VAULT_MANAGER = _VAULT_MANAGER;
        external_lp_enabled = _external_lp_enabled;
        collections = _collections;
        ltvs = _ltvs;
        initialAPR = _initialAPR;
        VAULT_CREATOR = address(this);
        
    }


}