pragma solidity ^0.8.9;

import "./interfaces/IDirectLoanCoordinator.sol";
import "./interfaces/IDirectLoanBase.sol";
import {VaultLib} from './VaultLib.sol';

contract VaultUtils {

    address public NFTFI_CONTRACT;
    address public NFTFI_COORDINATOR;

    constructor(address _NFTFI_CONTRACT, address _NFTFI_COORDINATOR){
        NFTFI_CONTRACT = _NFTFI_CONTRACT;
        NFTFI_COORDINATOR = _NFTFI_COORDINATOR;
    }

    

    function _preprocessPNNFTFi(uint32 _loanId, uint256 _loanAmount) external view returns (uint256, address, uint256, uint64)  {
        IDirectLoanCoordinator.Loan memory loan = IDirectLoanCoordinator(NFTFI_COORDINATOR).getLoanData(_loanId);
        require(loan.status == IDirectLoanCoordinator.StatusType.NEW, "It needs to be an active loan");

        (uint256 loanPrincipalAmount, , uint256 nftCollateralId, address loanERC20Denomination, uint32 loanDuration, , , , uint64 loanStartTime, address nftCollateralContract, ) = IDirectLoanBase(NFTFI_CONTRACT).loanIdToLoan(_loanId);
        require(loanERC20Denomination == 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, "The Loan must be in WETH");
        require(_loanAmount <= loanPrincipalAmount, "<=");

        return (loan.smartNftId, nftCollateralContract, nftCollateralId, loanStartTime + loanDuration);
    }
}