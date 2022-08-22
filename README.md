# PepeFi
PepeFi allows NFTFi lenders to take a loan on a loan, effectively replicating a put option purchase and allowing lenders to use leverage.

PepeFi does a few things differently than the prelevant NFT vaults. First, it provides loans on promissory notes instead of on NFTs. Most implementations of Vaults today can only offer loans on floor price; But people want variation. Thus, NFTFi keeps growing. However, few lenders in NFTFi dominate most of the lending volume. They would prefer instant liquidity, and if they have more liquidity available, it will be +EV for the entire NFT Market.


Next, people hate liquidation. Data from NFTFi shows that:

1) Lenders are happy to hold a negative equity loan. Despite such defaults, lenders yield higher than anything else in the market.
2) 40% of people repay their loans on negative equity. 
3) Most lenders in NFTFi provide a consistent LTV for a given set of collections for a set time. 

PepeFi integrates that concept in its NFTFi Vaults. It provides loans thru a vault whose creators determine APR, LTV, and supported collections. Different Vaults will exist at a given time, and depending on the risk profile of LPs, various Vaults can provide loans on different LTVs and APRs. 
To integrate the changing dynamics of the market, vaults have an expiry date. Later, to make the life of beginner LPs easy, a protocol can be built on top of PepeFi.


Finally, if lenders don't repay their loans by the end of the duration and borrowers default the principal, the NFT is instantly liquidated in sudoswap or listed for sale there until it sells. 

## Project Repository

The contracts are coded in hardhat inside contracts/ directory. tests are in /tests and deployment scripts are in /scripts. Create .env from .env-example by adding the private key of deployment contract and Alchemy API.

After installing the develepment and normal dependencies, contracts can then be compiled:
>npx hardhat compile

Start a local hardhat instance with a mainnet fork using:
>npx hardhat node


Then deploy the contracts locally and generate config file: 
>npm run deploy:localhost
or
>npx hardhat run scripts/deploy.sh --network localhost

For mainnet or kovan deployment change the params accordingly

Then start the application using:
>npm run dev

## Tests

>npm run test