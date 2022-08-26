library VaultLib{
    struct loanDetails {
        uint256 timestamp; //unix timestamp of when the bet was made

        address collateral; //collaret nft
        uint256 assetId; //asset ID

        uint256 smartNftId; //incase it is nftfi loan
        uint32 nftfiLoanId; //incase it is nftfi loan

        uint256 expirity; //expirity date of loan
        uint256 underlyingExpirity; //expirty in nftfi
        uint8 loanType; //0 for PN. 1 for nft
        uint256 loanPrincipalAmount; //principal taken
        uint256 repaymentAmount; //repayment amount
    }

    struct loanCreation {
        address nftCollateralContract; 
        uint256 nftCollateralId;
        uint256 loanPrincipal; 
        uint256 apr;
        uint256 loanExpirty; 
        uint256 smartNftId; 
        uint32 nftfiLoanId; 
        uint256 underlyingExpirity;
    }
}