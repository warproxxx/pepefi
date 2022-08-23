interface IVaultManager {
  function NFTFI_CONTRACT (  ) external view returns ( address );
  function NFTFI_TOKEN (  ) external view returns ( address );
  function SUDOSWAP_CONTRACT (  ) external view returns ( address );
  function WETH (  ) external view returns ( address );
  function createVault ( string calldata, uint256 _expirityDate, address[] memory, uint256[] memory, uint256 _initialAPR, bool _external_lp_enabled, uint256 liquidityAdded ) external returns ( address );
  function getAllVaults (  ) external view returns ( address[] memory );
  function getContractAddresses (  ) external returns ( address, address, address, address, address );
}
