let ACCEPTED_COLLECTIONS=[{"name":"Bored Ape Yacht Club","address":"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d","imgSrc":"/static/images/vaults/boredapeyachtclub.png","slug":"boredapeyachtclub"},{"name":"Doodle","address":"0x8a90cab2b38dba80c64b7734e58ee1db38b8992e","imgSrc":"/static/images/vaults/doodles-official.png","slug":"doodles-official"},{"name":"Moonbirds","address":"0x23581767a106ae21c074b2276d25e5c3e136a68b","imgSrc":"/static/images/vaults/proof-moonbirds.png","slug":"proof-moonbirds"},{"name":"CloneX","address":"0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b","imgSrc":"/static/images/vaults/clonex.png","slug":"clonex"},{"name":"CryptoDickbutts","address":"0x42069abfe407c60cf4ae4112bedead391dba1cdb","imgSrc":"/static/images/vaults/cryptodickbutts-s3.png","slug":"cryptodickbutts-s3"},{"name":"Wrapped Cryptopunks","address":"0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb","imgSrc":"/static/images/vaults/wrapped-cryptopunks.png","slug":"wrapped-cryptopunks"}]
let WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
let NFTFI = '0xf896527c49b44aAb3Cf22aE356Fa3AF8E331F280'
let NFTFI_COORDINATOR = '0x0C90C8B4aa8549656851964d5fB787F0e4F54082'
let NFTFI_NOTE = '0x5660e206496808f7b5cdb8c56a696a96ae5e9b23'

let ERC20_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
let ERC721_ABI = [{"inputs":[{"internalType":"address","name":"_admin","type":"address"},{"internalType":"address","name":"_nftfiHub","type":"address"},{"internalType":"address","name":"_loanCoordinator","type":"address"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_customBaseURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"BASE_URI_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOAN_COORDINATOR_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"exists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hub","outputs":[{"internalType":"contract INftfiHub","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"loans","outputs":[{"internalType":"address","name":"loanCoordinator","type":"address"},{"internalType":"uint256","name":"loanId","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_customBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"setLoanCoordinator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]

let PEPEAUCTION_ABI = [{"inputs":[{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_auctions","outputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"loanId","type":"uint256"},{"internalType":"address","name":"collateral","type":"address"},{"internalType":"uint256","name":"assetId","type":"uint256"},{"internalType":"uint256","name":"startingPrice","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256","name":"decreasePercentage","type":"uint256"},{"internalType":"address","name":"withdraw","type":"address"},{"internalType":"address","name":"liquidator","type":"address"},{"internalType":"uint32","name":"liquidatorFee","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"auctions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_auctionId","type":"uint256"}],"name":"buy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_loanId","type":"uint256"},{"internalType":"address","name":"_nft","type":"address"},{"internalType":"uint256","name":"_nftId","type":"uint256"},{"internalType":"uint256","name":"_startingPrice","type":"uint256"},{"internalType":"uint256","name":"_duration","type":"uint256"},{"internalType":"uint256","name":"_discountRate","type":"uint256"},{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_liquidator","type":"address"},{"internalType":"uint32","name":"liquidatorFee","type":"uint32"}],"name":"createAuction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllAuctions","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_auctionId","type":"uint256"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
let PEPEFIORACLE_ABI = [{"inputs":[{"internalType":"address","name":"_updater","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"collection","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"OracleUpdate","type":"event"},{"inputs":[{"internalType":"address","name":"_collection","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"prices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_collections","type":"address[]"},{"internalType":"uint256[]","name":"_values","type":"uint256[]"}],"name":"updatePrices","outputs":[],"stateMutability":"nonpayable","type":"function"}]
let VAULT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[],"name":"VAULT_NAME","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_loans","outputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"collateral","type":"address"},{"internalType":"uint256","name":"assetId","type":"uint256"},{"internalType":"uint256","name":"smartNftId","type":"uint256"},{"internalType":"uint32","name":"nftfiLoanId","type":"uint32"},{"internalType":"uint256","name":"expirity","type":"uint256"},{"internalType":"uint256","name":"underlyingExpirity","type":"uint256"},{"internalType":"uint256","name":"loanPrincipalAmount","type":"uint256"},{"internalType":"uint256","name":"repaymentAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"all_loans","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_loanId","type":"uint256"}],"name":"createAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"expireVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"expirityDate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_loanId","type":"uint256"}],"name":"finishedAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllLoans","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getVaultDetails","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWETHBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_VAULT_NAME","type":"string"},{"internalType":"address","name":"_VAULT_MANAGER","type":"address"},{"internalType":"address","name":"_VAULT_ADMIN","type":"address"},{"internalType":"uint256","name":"_expirityDate","type":"uint256"},{"internalType":"address[]","name":"_collections","type":"address[]"},{"internalType":"uint32[]","name":"_ltvs","type":"uint32[]"},{"internalType":"uint32[]","name":"_aprs","type":"uint32[]"},{"internalType":"bool","name":"_external_lp_enabled","type":"bool"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"_loanId","type":"uint32"}],"name":"repayLoan","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"nftCollateralContract","type":"address"},{"internalType":"uint256","name":"nftCollateralId","type":"uint256"},{"internalType":"uint256","name":"_loanAmount","type":"uint256"},{"internalType":"uint256","name":"_repaymentDate","type":"uint256"}],"name":"takeERC721Loan","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"_loanId","type":"uint32"},{"internalType":"uint256","name":"_loanAmount","type":"uint256"},{"internalType":"uint256","name":"_repaymentDate","type":"uint256"}],"name":"takePNNFILoan","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"withdrawLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"}]
let VAULTMANAGER_ABI = [{"inputs":[{"internalType":"address","name":"_WETH","type":"address"},{"internalType":"address","name":"_NFTFI_CONTRACT","type":"address"},{"internalType":"address","name":"_NFTFI_COORDINATOR","type":"address"},{"internalType":"address","name":"_NFTFI_TOKEN","type":"address"},{"internalType":"address","name":"_ORACLE_CONTRACT","type":"address"},{"internalType":"address","name":"_AUCTION_CONTRACT","type":"address"},{"internalType":"address","name":"_UTILS_CONTRACT","type":"address"},{"internalType":"address","name":"_VAULT_IMPLEMENTATION","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"_VAULT_NAME","type":"string"},{"internalType":"uint256","name":"_expirityDate","type":"uint256"},{"internalType":"address[]","name":"_collections","type":"address[]"},{"internalType":"uint32[]","name":"_ltvs","type":"uint32[]"},{"internalType":"uint32[]","name":"_aprs","type":"uint32[]"},{"internalType":"bool","name":"_external_lp_enabled","type":"bool"},{"internalType":"uint256","name":"liquidityAdded","type":"uint256"}],"name":"createVault","outputs":[{"internalType":"address","name":"vault","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllVaults","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContractAddresses","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"vaults","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
let VAULTUTILS_ABI = [{"inputs":[{"internalType":"address","name":"_NFTFI_CONTRACT","type":"address"},{"internalType":"address","name":"_NFTFI_COORDINATOR","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"NFTFI_CONTRACT","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NFTFI_COORDINATOR","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"_loanId","type":"uint32"},{"internalType":"uint256","name":"_loanAmount","type":"uint256"}],"name":"_preprocessPNNFTFi","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"}]


let ORACLE_CONTRACT='0xe38b6847E611e942E6c80eD89aE867F522402e80'
let VAULT_MANAGER='0x7580708993de7CA120E957A62f26A5dDD4b3D8aC'

module.exports = {ACCEPTED_COLLECTIONS,WETH,NFTFI,NFTFI_COORDINATOR,NFTFI_NOTE,ERC20_ABI,ERC721_ABI,PEPEAUCTION_ABI,PEPEFIORACLE_ABI,VAULT_ABI,VAULTMANAGER_ABI,VAULTUTILS_ABI,ORACLE_CONTRACT,VAULT_MANAGER}