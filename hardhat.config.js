require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');
require("hardhat-interface-generator");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

abiExporter: [
  {
    pretty: false,
    runOnCompile: true
  }
]

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/[process.env.ALCHEMY_API]",
        accounts: [process.env.ETH_KEY]
      }
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/[process.env.ALCHEMY_API]",
      accounts: [process.env.ETH_KEY]
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 21
  }
};
