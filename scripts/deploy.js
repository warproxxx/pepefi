const util = require('util');
const exec = util.promisify(require('child_process').exec);
const hre = require("hardhat");
const { promises: { readdir } } = require('fs')
const fs = require("fs");
const { ethers } = require("hardhat");

let contracts = {};


if (process.env.HARDHAT_NETWORK == 'rinkeby')
{
    contracts['WETH'] = "0xc778417e063141139fce010982780140aa0cd5ab"
    contracts['NFTFI'] = "0x33e75763F3705252775C5AEEd92E5B4987622f44"
    contracts['NFTFI_COORDINATOR'] = "0x33e75763F3705252775C5AEEd92E5B4987622f44"
    contracts['NFTFI_NOTE'] = "0x33e75763F3705252775C5AEEd92E5B4987622f44"
    contracts['SUDOSWAP_ROUTER'] = "0x9ABDe410D7BA62fA11EF37984c0Faf2782FE39B5"
}
else
{
    contracts['WETH'] = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    contracts['NFTFI'] = "0xf896527c49b44aAb3Cf22aE356Fa3AF8E331F280"
    contracts['NFTFI_COORDINATOR'] = "0x0C90C8B4aa8549656851964d5fB787F0e4F54082"
    contracts['NFTFI_NOTE'] = "0x5660e206496808f7b5cdb8c56a696a96ae5e9b23"
    contracts['SUDOSWAP_ROUTER'] = "0x2b2e8cda09bba9660dca5cb6233787738ad68329" //https://docs.sudoswap.xyz/contracts/
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
    // if ((await NFT_CONTRACT.ownerOf('12699013038842394238')).toLowerCase() == WHALE.toLowerCase())
    // {    
    //     console.log("Transferring Dickbutts")

    //     await NFT_CONTRACT.transferFrom(WHALE, '0x5664198BDb6AB7337b70742ff4BDD935f81e4Dcd', '12699013038842394238', { 
    //         from: WHALE,
    //     })

    //     // https://etherscan.io/tx/0x378de6d4712b911ba9c51ec5112d1c6c63ebf8dc2257854cbf1826f14892ccbf // 2192
    // }

    // if ((await NFT_CONTRACT.ownerOf('14103957916149294123')).toLowerCase() == WHALE.toLowerCase())
    // { 
    //     console.log("Transferring Dickbutts")
    //     await NFT_CONTRACT.transferFrom(WHALE, '0x99c6fD3bC02dEB420F192eFb3ED0D6f479856D4B', '14103957916149294123', {
    //         from: WHALE,
    //     })

    //     // https://etherscan.io/tx/0x4561823f2241f1fa503f4051d737d33b0c28e970a05e88ac4ea6ae156cf33c5c // 2317
    // }



    return owner;
}

async function deploy(){

    if (process.env.HARDHAT_NETWORK == 'localhost'){
        await perform_whale_transfer()
    }


    let ABI_STRING = ""
    let export_string = "module.exports = {"

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

    const OracleManager = await ethers.getContractFactory("PepeFiOracle");
    or = await OracleManager.deploy(owner.address);
    await or.deployed(); 
    console.log("Oracle Contract Deployed at " + or.address);

    const VaultManager = await ethers.getContractFactory("VaultManager");
    let vm = await VaultManager.deploy(contracts['WETH'], contracts['NFTFI'],  contracts['NFTFI_COORDINATOR'], contracts['NFTFI_NOTE'], or.address );
    await vm.deployed();  
    console.log("Vault Manager Contract Deployed at " + vm.address);

    ABI_STRING = ABI_STRING + "let ORACLE_CONTRACT='" + or.address + "'\n"
    ABI_STRING = ABI_STRING + "let VAULT_MANAGER='" + vm.address + "'\n\n"
    export_string = export_string + "ORACLE_CONTRACT,VAULT_MANAGER}"

    ABI_STRING = ABI_STRING + export_string

    fs.writeFileSync('src/config.js', ABI_STRING);   
}

if (require.main === module) {
    deploy()
}

module.exports.perform_whale_transfer = perform_whale_transfer;