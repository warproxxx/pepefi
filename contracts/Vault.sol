pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Vault is ERC1155{
    string public VAULT_NAME;
    address public WETH;
    bool public external_lp_enabled;
    address public VAULT_MANAGER;

    modifier onlyVaultManager {
        require (msg.sender == VAULT_MANAGER);
        _;
    }

    constructor(string memory _VAULT_NAME, address _WETH, address _VAULT_MANAGER, bool _external_lp_enabled) ERC1155("https://example.com"){
        VAULT_NAME = _VAULT_NAME;
        WETH = _WETH;
        VAULT_MANAGER = _VAULT_MANAGER;
        external_lp_enabled = _external_lp_enabled;
    }


}