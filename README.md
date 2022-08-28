# PepeFi
Data from NFTFi shows that:

1) Lenders are happy to hold a negative equity loan. Despite such defaults, lenders yield higher return than anything else in the market.
2) >50% of borrowers repay their loans even on negative equity. 
3) Most lenders in NFTFi provide a consistent LTV for a given set of collections for a set time. 

PepeFi integrates these concepts in its Vaults. Pepefi allows NFTFi lenders to take a loan on an NFT or on a NFTFi loan. Providing loans on loans effectively replicates a put option purchase and allows lenders to use leverage. Few sophisticated lenders in NFTFi dominate most of the lending volume. If they have more liquidity available, it will be +EV for the entire NFT Market.

PepeFi provides loans on NFT or on an NFTFi loan thru a vault whose creators determine APR, LTV, and supported collections. To integrate the changing dynamics of the market, vaults have an expiry date (Later, to make the life of beginner LPs easy, a protocol can be built on top of PepeFi). Different Vaults will exist at a given time and anyone can create a vault. Depending on the risk profile of LPs, various Vaults can provide loans on different LTVs and APRs. This creates competition among Vault Creators and LPs, making the market more efficient for borrowers.

As people hate liquidation PepeFi doesn't liquidate loans till the end of loan duration. If the loan is still not repaid, liquidators can start a dutch auction which starts at the MIN(1.1 * floor price, repaymentAmount) and decreases by 2% every hour. We do not believe that we can't provide "riskless" loans on NFTs and get yield out of it; thus, LPs will sometimes take a hit. But data from NFTFi shows that the yield for NFTs is higher than anything else on the market despite the default.

## Project Repository

The contracts are coded in hardhat inside contracts/ directory. tests are in /tests and deployment scripts are in /scripts. Create .env from .env-example by adding the private key of deployment contract and Alchemy API.

After installing the develepment and normal dependencies, contracts can then be compiled:
>npx hardhat compile

Start a local hardhat instance with a mainnet fork using:
>npx hardhat node


Then deploy the contracts locally and generate config file: 
>npm run build:hardhat
or
>npx hardhat run scripts/deploy.sh --network localhost

Initially price for selected collections will be automatically set. To start the oracle which updates price on 5% deviation, start the oracle script with:
>npm run start:oracle

For mainnet or rinkeby deployment change the params accordingly

Then start the application using:
>npm run dev


## Tests
Before running tests, make sure to run npm run build:hardhat to create the configuration file. Then run tests using:
>npm run test