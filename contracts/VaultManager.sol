pragma solidity ^0.8.9;

import "./Vault.sol";

contract VaultManager{

    address public WETH;
    address[] vaults;


    constructor(address _WETH){
        WETH = _WETH;
    }

    function createVault( string calldata _VAULT_NAME, uint256 _expirityDate, address[] memory _collections, uint256[] memory _ltvs, uint256 _initialAPR, bool _external_lp_enabled, uint256 liquidityAdded) public returns (address) {
        if (liquidityAdded > 0){
            (bool success, bytes memory data) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), liquidityAdded));
            require(success, "Cannot transfer DAI");
        }
        
        Vault vault = new Vault(_VAULT_NAME, WETH, address(this), _expirityDate, _collections, _ltvs, _initialAPR, _external_lp_enabled);
        vaults.push(address(vault));

        return address(vault);
    }

    function getAllVaults() public view returns (address[] memory) {
        return vaults;
    }





}