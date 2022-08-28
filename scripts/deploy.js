const util = require('util');
const exec = util.promisify(require('child_process').exec);
const axios = require('axios')

const hre = require("hardhat");
const { promises: { readdir } } = require('fs')
const fs = require("fs");
const { ethers } = require("hardhat");

let contracts = {};
let acceptedCollections;

if (process.env.HARDHAT_NETWORK == 'rinkeby')
{
    contracts['WETH'] = "0xc778417e063141139fce010982780140aa0cd5ab"
    contracts['NFTFI'] = "0x33e75763f3705252775c5aeed92e5b4987622f44"
    contracts['NFTFI_COORDINATOR'] = "0x889d2b579d356cAe709422F3DDC7D2e61902917e"
    contracts['NFTFI_NOTE'] = "0x191b74d99327777660892b46a7c94ca25c896dc7"

    acceptedCollections = [
        { name: 'Multifaucet NFT', address: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b', imgSrc:'https://img.seadn.io/files/b4d419a67bc7dc52000e6d1336b24c46.png?fit=max&w=600', slug: 'multifaucet-nft-q55yxxitoz'},
    ]
}
else
{
    contracts['WETH'] = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    contracts['NFTFI'] = "0xf896527c49b44aAb3Cf22aE356Fa3AF8E331F280"
    contracts['NFTFI_COORDINATOR'] = "0x0C90C8B4aa8549656851964d5fB787F0e4F54082"
    contracts['NFTFI_NOTE'] = "0x5660e206496808f7b5cdb8c56a696a96ae5e9b23"

    acceptedCollections = [
        { name: 'Bored Ape Yacht Club', address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',imgSrc:'/static/images/vaults/boredapeyachtclub.png', slug: 'boredapeyachtclub', },
        { name: 'Doodle', address: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e',imgSrc:'/static/images/vaults/doodles-official.png', slug: 'doodles-official'},
        { name: 'Moonbirds', address: '0x23581767a106ae21c074b2276d25e5c3e136a68b',imgSrc:'/static/images/vaults/proof-moonbirds.png', slug: 'proof-moonbirds'},
        { name: 'CloneX', address: '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b',imgSrc:'/static/images/vaults/clonex.png', slug: 'clonex'},
        { name: 'CryptoDickbutts', address: '0x42069abfe407c60cf4ae4112bedead391dba1cdb', imgSrc: '/static/images/vaults/cryptodickbutts-s3.png', slug: 'cryptodickbutts-s3'},
        { name: 'Wrapped Cryptopunks', address: '0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6', imgSrc: '/static/images/vaults/wrapped-cryptopunks.png', slug: 'wrapped-cryptopunks'}
    ]
}




let abis = {}

abis['ERC20_ABI'] = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'
abis['ERC721_ABI'] = '[{"inputs":[{"internalType":"address","name":"_admin","type":"address"},{"internalType":"address","name":"_nftfiHub","type":"address"},{"internalType":"address","name":"_loanCoordinator","type":"address"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_customBaseURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"BASE_URI_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOAN_COORDINATOR_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"exists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hub","outputs":[{"internalType":"contract INftfiHub","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"loans","outputs":[{"internalType":"address","name":"loanCoordinator","type":"address"},{"internalType":"uint256","name":"loanId","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_customBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"setLoanCoordinator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

async function perform_whale_transfer() {

    
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [contracts['WETH']],
    });

    // //get signer
    [owner] = await ethers.getSigners();

    //Transfer from a whale to our account to run tests
    const whale_signer = await ethers.provider.getSigner(contracts['WETH']);
    let WETH_CONTRACT = await ethers.getContractAt(JSON.parse(abis['ERC20_ABI']), contracts['WETH'], whale_signer);


    for (let addy of [owner.address, '0x5664198BDb6AB7337b70742ff4BDD935f81e4Dcd', '0x99c6fD3bC02dEB420F192eFb3ED0D6f479856D4B']) {
        let eth_balance = parseInt((await whale_signer.getBalance())['_hex']) / 10**18
        let weth_balance = parseInt((await WETH_CONTRACT.balanceOf(contracts['WETH']))['_hex']) / 10**18

        if (eth_balance > 10) {

            await whale_signer.sendTransaction({
                to: addy,
                value: ethers.utils.parseEther("10")
            });
        }

        if (weth_balance > 10){

            await WETH_CONTRACT.transfer(addy, (BigInt(10)*BigInt(10**18)).toString(), {
                from: contracts['WETH'],
            });
        }
    }


    //send dickbutts to each
    let DICKBUTTS = '0x42069abfe407c60cf4ae4112bedead391dba1cdb'
    let WHALE = '0x025762aDE7B5CFf192e6f09932472819C35D6bdA'


    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [WHALE],
    });

    const nft_signer = await ethers.provider.getSigner(WHALE);
    let NFT_CONTRACT = await ethers.getContractAt(JSON.parse(abis['ERC721_ABI']), '0x5660e206496808f7b5cdb8c56a696a96ae5e9b23', nft_signer);
    
    

    //only transfer if owned
    if ((await NFT_CONTRACT.ownerOf('12699013038842394238')).toLowerCase() == WHALE.toLowerCase())
    {    
        console.log("Transferring Dickbutts")

        await NFT_CONTRACT.transferFrom(WHALE, '0x5664198BDb6AB7337b70742ff4BDD935f81e4Dcd', '12699013038842394238', { 
            from: WHALE,
        })

        // https://etherscan.io/tx/0x378de6d4712b911ba9c51ec5112d1c6c63ebf8dc2257854cbf1826f14892ccbf // 2192
    }

    if ((await NFT_CONTRACT.ownerOf('14103957916149294123')).toLowerCase() == WHALE.toLowerCase())
    { 
        console.log("Transferring Dickbutts")
        await NFT_CONTRACT.transferFrom(WHALE, '0x99c6fD3bC02dEB420F192eFb3ED0D6f479856D4B', '14103957916149294123', {
            from: WHALE,
        })

        // https://etherscan.io/tx/0x4561823f2241f1fa503f4051d737d33b0c28e970a05e88ac4ea6ae156cf33c5c // 2317
    }

    //also transfer apes here
    let IMPERSO = '0x1b523dc90a79cf5ee5d095825e586e33780f7188'

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [IMPERSO],
    });

    const nft_signer2 = await ethers.provider.getSigner(IMPERSO);
    let NFT_CONTRACT2 = await ethers.getContractAt(JSON.parse(abis['ERC721_ABI']), '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', nft_signer2);
    
    let NOTE = "9547"

    if ((await NFT_CONTRACT2.ownerOf(NOTE)).toLowerCase() == IMPERSO.toLowerCase())
    { 
        console.log("Transferring BAYC")
        await NFT_CONTRACT2.transferFrom(IMPERSO, "0x5664198BDb6AB7337b70742ff4BDD935f81e4Dcd", NOTE, {
            from: IMPERSO,
        })
    }


    return owner;
}

async function updateOracleOnce(){
    

    let prices = {}
    let addys = []
    let newPrice = []

    if (process.env.HARDHAT_NETWORK == 'rinkeby'){
        let { ORACLE_CONTRACT, ACCEPTED_COLLECTIONS } =  require("../src/config_rinkeby.js")
        let ORACLE = await ethers.getContractAt("PepeFiOracle", ORACLE_CONTRACT);
        await ORACLE.updatePrices(["0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b"], [(0.1 * 10**18).toString()])
        console.log("Rinkeby Oracle updated")
    }else {
        //This logic might have errors. Live needs a much better backtested one
        let { ORACLE_CONTRACT, ACCEPTED_COLLECTIONS } =  require("../src/config.js")

        let ORACLE = await ethers.getContractAt("PepeFiOracle", ORACLE_CONTRACT);

        for (collection of ACCEPTED_COLLECTIONS){

            

            try {
                let res = await axios.get(`https://api.reservoir.tools/oracle/collections/${collection['address']}/floor-ask/v1`);
                prices['reservoir'] = res['data']['price'] * 10**18
            } catch (error) {
                
            }
            
            
            try {
                let rare = await axios.get(`https://api.looksrare.org/api/v1/collections/stats?address=${collection['address']}`)
                prices['looksrare'] = parseInt(rare['data']['data']['floorPrice'])
            } catch (error) {
                
            }

            try {
                //most important because collection is not unique
                let open = await axios.get(`https://api.opensea.io/api/v1/collection/${collection['slug']}/stats`)
                prices['opensea'] = open['data']['stats']['floor_price'] * 10**18
            } catch (error) {
            
            }

            //now loop thru to find the minimum which is not nan or 0
            
            let minimum = 0

            for (const [key, value] of Object.entries(prices)) {
                if ((value != 0) && (isNaN(value) == false)){
                    if (minimum == 0)
                        minimum = value

                    if (value < minimum)
                        minimum = value
                }
            }

            if (minimum != 0){
                let oraclePrice = await ORACLE.getPrice(collection['address'])

                if (oraclePrice <= minimum * 0.95 || oraclePrice >= minimum * 1.05){
                    console.log(`Updating ${collection['address']} price to ${minimum} from ${oraclePrice}`)

                    addys.push(collection['address'])
                    newPrice.push(minimum.toString())
                }
            }
            
        }

        await ORACLE.updatePrices(addys, newPrice)
    }
}

async function deploy(){
    let [signer] = await ethers.getSigners();

    if (process.env.HARDHAT_NETWORK == 'localhost'){
        await perform_whale_transfer()
    }
    

    let ABI_STRING = ""
    let export_string = "module.exports = {"

    ABI_STRING = ABI_STRING + "let ACCEPTED_COLLECTIONS=" + JSON.stringify(acceptedCollections) + "\n";
    export_string = export_string + "ACCEPTED_COLLECTIONS,"

    for (const [key, value] of Object.entries(contracts)) {
        ABI_STRING = ABI_STRING + `let ${key} = '${value}'\n`        
        export_string = export_string + key + ","
    }

    ABI_STRING = ABI_STRING + "\n"

    for (const [key, value] of Object.entries(abis)) {
        ABI_STRING = ABI_STRING + `let ${key} = ${value}\n`        
        export_string = export_string + key + ","

    }

    ABI_STRING = ABI_STRING + "\n"

    await exec("yarn run hardhat export-abi")
    let path = './abi/contracts'
    let dir = await readdir(path, { withFileTypes: true })

    dir.forEach((value) => {
        let name = value.name

        if (name.includes(".sol")){
            let full_path = path + "/" + name + "/" + name.replace(".sol", ".json");
            let contents = fs.readFileSync(full_path).toString().replace(/(\r\n|\n|\r)/gm,"")

            let var_name = name.replace(".sol", "").toUpperCase()
            
            ABI_STRING = ABI_STRING + "let " + var_name + "_ABI" + " = " + contents.replace(/\s/g, '') + "\n"  
            export_string = export_string + var_name + "_ABI,"
         
        }
    })

    ABI_STRING = ABI_STRING + "\n\n"

    const PepeAuction = await ethers.getContractFactory("PepeAuction");
    pe = await PepeAuction.deploy(contracts['WETH']);
    await pe.deployed();  
    console.log("Auction Contract Deployed at " + pe.address);


    const VaultUtils = await ethers.getContractFactory("VaultUtils");
    vu = await VaultUtils.deploy(contracts['NFTFI'],  contracts['NFTFI_COORDINATOR']);
    await vu.deployed();  
    console.log("Utils Contract Deployed at " + vu.address);

    const OracleManager = await ethers.getContractFactory("PepeFiOracle");
    or = await OracleManager.deploy(signer.address);
    await or.deployed(); 
    console.log("Oracle Contract Deployed at " + or.address);

    const VaultSkeleton = await ethers.getContractFactory("Vault");
    vs = await VaultSkeleton.deploy()
    await vs.deployed();  

    const VaultManager = await ethers.getContractFactory("VaultManager");
    let vm = await VaultManager.deploy(contracts['WETH'], contracts['NFTFI'],  contracts['NFTFI_COORDINATOR'], contracts['NFTFI_NOTE'], or.address, pe.address, vu.address, vs.address );
    await vm.deployed();  
    console.log("Vault Manager Contract Deployed at " + vm.address);

    if (process.env.HARDHAT_NETWORK != 'rinkeby'){
        let res = await vm.createVault('Test Vault', 1700695053, ['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', '0x42069abfe407c60cf4ae4112bedead391dba1cdb', '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6'], [500, 500, 400, 500], [450, 450, 450, 450], true, 0)
    }

    ABI_STRING = ABI_STRING + "let ORACLE_CONTRACT='" + or.address + "'\n"
    ABI_STRING = ABI_STRING + "let VAULT_MANAGER='" + vm.address + "'\n\n"
    export_string = export_string + "ORACLE_CONTRACT,VAULT_MANAGER}"

    ABI_STRING = ABI_STRING + export_string

    if (process.env.HARDHAT_NETWORK == 'rinkeby'){
        fs.writeFileSync('src/config_rinkeby.js', ABI_STRING);   
    }
    else{
        fs.writeFileSync('src/config.js', ABI_STRING);
    }

    await updateOracleOnce()
}


if (require.main === module) {
    deploy()
}


module.exports = {perform_whale_transfer, updateOracleOnce};