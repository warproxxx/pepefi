pragma solidity ^0.8.9;

interface IVault {
  function addLiquidity ( uint256 _amount ) external;
  function createAuction ( uint256 _loanId ) external;
  function finishedAuction ( uint256 _loanId ) external;
}
