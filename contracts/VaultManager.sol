pragma solidity ^0.8.9;

import "./Vault.sol";

contract VaultManager{

    address public WETH;
    address public NFTFI_COORDINATOR;

    address public NFTFI_CONTRACT;
    address public NFTFI_TOKEN;
    address public ORACLE_CONTRACT;
    address public AUCTION_CONTRACT;

    address[] vaults;


    constructor(address _WETH, address _NFTFI_CONTRACT, address _NFTFI_COORDINATOR, address _NFTFI_TOKEN, address _ORACLE_CONTRACT, address _AUCTION_CONTRACT){
        WETH = _WETH;
        NFTFI_CONTRACT = _NFTFI_CONTRACT;
        NFTFI_TOKEN = _NFTFI_TOKEN;
        ORACLE_CONTRACT = _ORACLE_CONTRACT;
        NFTFI_COORDINATOR = _NFTFI_COORDINATOR;
        AUCTION_CONTRACT = _AUCTION_CONTRACT;
    }

    function createVault( string calldata _VAULT_NAME, uint256 _expirityDate, address[] memory _collections, uint256[] memory _ltvs, uint256[] memory _aprs, bool _external_lp_enabled, uint256 liquidityAdded) public returns (address) {
        if (liquidityAdded > 0){
            (bool success, bytes memory data) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), liquidityAdded));
            require(success, "Cannot transfer DAI");
        }
        
        // Vault vault = new Vault(_VAULT_NAME, address(this), _expirityDate, _collections, _ltvs, _aprs, _external_lp_enabled);
        // vaults.push(address(vault));

        // return address(vault);
    }

    function getAllVaults() public view returns (address[] memory) {
        return vaults;
    }

    function getContractAddresses() public returns (address, address, address, address, address, address){
        return (WETH, NFTFI_CONTRACT, NFTFI_COORDINATOR, NFTFI_TOKEN, ORACLE_CONTRACT, AUCTION_CONTRACT);
    }





}