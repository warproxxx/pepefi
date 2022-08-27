pragma solidity ^0.8.9;

import "./interfaces/IVault.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract VaultManager{

    address private WETH;
    address private NFTFI_COORDINATOR;

    address private NFTFI_CONTRACT;
    address private NFTFI_TOKEN;
    address private ORACLE_CONTRACT;
    address private AUCTION_CONTRACT;
    address private UTILS_CONTRACT;

    address[] public vaults;

    address private VAULT_IMPLEMENTATION;


    constructor(address _WETH, address _NFTFI_CONTRACT, address _NFTFI_COORDINATOR, address _NFTFI_TOKEN, address _ORACLE_CONTRACT, address _AUCTION_CONTRACT, address _UTILS_CONTRACT, address _VAULT_IMPLEMENTATION){
        WETH = _WETH;
        NFTFI_CONTRACT = _NFTFI_CONTRACT;
        NFTFI_TOKEN = _NFTFI_TOKEN;
        ORACLE_CONTRACT = _ORACLE_CONTRACT;
        NFTFI_COORDINATOR = _NFTFI_COORDINATOR;
        AUCTION_CONTRACT = _AUCTION_CONTRACT;
        UTILS_CONTRACT = _UTILS_CONTRACT;
        VAULT_IMPLEMENTATION = _VAULT_IMPLEMENTATION;
    }

    function createVault( string calldata _VAULT_NAME, uint256 _expirityDate, address[] memory _collections, uint32[] memory _ltvs, uint32[] memory _aprs, bool _external_lp_enabled, uint256 liquidityAdded) public returns (address vault) {
        if (liquidityAdded > 0){
            (bool success, ) = WETH.call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), liquidityAdded));
            require(success, "Cannot transfer DAI");
        }

        vault = Clones.clone(VAULT_IMPLEMENTATION);
        IVault(vault).initialize(_VAULT_NAME, address(this), msg.sender, _expirityDate, _collections, _ltvs, _aprs, _external_lp_enabled);
        
        vaults.push(address(vault));
    }

    function getContractAddresses() public view returns (address, address, address, address, address, address, address)  {
        return (WETH, NFTFI_CONTRACT, NFTFI_COORDINATOR, NFTFI_TOKEN, ORACLE_CONTRACT, AUCTION_CONTRACT, UTILS_CONTRACT);
    }

    function getAllVaults() public view returns (address[] memory) {
        return vaults;
    }
}