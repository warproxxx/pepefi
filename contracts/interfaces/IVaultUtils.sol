pragma solidity ^0.8.9;

interface IVaultUtils {
  function _preprocessPNNFTFi ( uint32 _loanId, uint256 _loanAmount ) external returns (uint256, address, uint256, uint64);
  function getCollateralDetails ( address[] calldata collections, uint256[] calldata ltvs, uint256[] calldata aprs, address nftCollateralContract ) external returns (address, uint256, uint256);

}
