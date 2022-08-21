# PepeFi
PepeFi allows NFTFi lenders to take a loan on a loan, effectively replicating a put option purchase and allowing lenders to use leverage.

The loans are provided thru an automated vault whose initial Vault Creators determine inital APR and LTV. The APR is then increased using a bonding curve to incentivize free balance allowing LP withdrawals. Depending on the risk profile of LPs, different Vaults can provide loans on different LTVs and APRs for the LPs.

PepeFi does a few things differently than the prelevant NFT vaults. First, it provides loans on promissory notes instead of on NFTs. Most implementations of Vaults today can only offer loans on floor price; But people want variation. Thus, NFTFi keeps growing. However, lenders are more sophisticated. Few lenders in NFTFi dominate most of the lending volume. They would prefer instant liquidity. And, if they have more liquidity available, it will be +EV for the entire NFT Market.

Next, people hate liquidation. The prevalence of lenders in NFTFi shows that lenders are willing to provide loans with the risk of defaults. And data from NFTFi shows that lenders are making an APR higher than anything else in the market, despite the defaults. Further, the data from NFTFi shows that market is not rational. n% of the time, people repay their loans even on negative equity. 

PepeFi takes these findings into a Vault system. If lenders don't repay their loans by the end of the duration and borrowers don't default the principal, the NFT is instantly liquidated in sudoswap or listed for sale there until it sells. 

## Project Repository

The contracts are coded in hardhat inside contracts/ directory. tests are in /tests and deployment scripts are in /scripts.

A local hardhat instance can be started with a mainnet fork using:
    npx hardhat node

Compile the contracts
    npx hardhat compile


Then deploy the contracts locally using: 
    npx hardhat run scripts/deploy.sh --network localhost

For mainnet or kovan deployment set the network accordingly

Then start the application using:
    npm run dev


To run the tests:
    npx hardhat test