pragma solidity ^0.8.9;

interface IVault {
  function addLiquidity ( uint256 _amount ) external;
  function createAuction ( uint256 _loanId ) external;
  function finishedAuction ( uint256 _loanId ) external;
  function initialize(string memory, address _VAULT_MANAGER, address _VAULT_ADMIN, uint256 _expirityDate, address[] memory _collections, uint32[] memory _ltvs, uint32[] memory _aprs, bool _external_lp_enabled) external;
}
