pragma solidity ^0.8.9;

interface IVaultUtils {
  function _preprocessPNNFTFi ( uint32 _loanId, uint256 _loanAmount ) external returns (uint256, address, uint256, uint64);

}
