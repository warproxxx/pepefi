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
    contracts['NFTFI_NOTE'] = "0x33e75763F3705252775C5AEEd92E5B4987622f44"
    contracts['SUDOSWAP_ROUTER'] = "0x9ABDe410D7BA62fA11EF37984c0Faf2782FE39B5"
}
else
{
    contracts['WETH'] = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    contracts['NFTFI'] = "0xf896527c49b44aAb3Cf22aE356Fa3AF8E331F280"
    contracts['NFTFI_NOTE'] = "0x5660e206496808f7b5cdb8c56a696a96ae5e9b23"
    contracts['SUDOSWAP_ROUTER'] = "0x2b2e8cda09bba9660dca5cb6233787738ad68329" //https://docs.sudoswap.xyz/contracts/
}


let abis = {}

abis['ERC20_ABI'] = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'
abis['ERC721_ABI'] = '[{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]'



async function perform_whale_transfer() {


    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [contracts['WETH']],
    });

    // //get signer
    [owner] = await ethers.getSigners();

    //Transfer from a whale to our account to run tests
    const whale_signer = await ethers.provider.getSigner(contracts['WETH']);
    let WETH_CONTRACT = await ethers.getContractAt(JSON.parse(abis['ERC20_ABI']), contracts['WETH'],  whale_signer);

    for (let addy of [owner.address, '0x5664198BDb6AB7337b70742ff4BDD935f81e4Dcd', '0x99c6fD3bC02dEB420F192eFb3ED0D6f479856D4B']) {
        let eth_balance = parseInt((await whale_signer.getBalance())['_hex']) / 10**18
        let weth_balance = parseInt((await WETH_CONTRACT.balanceOf(contracts['WETH']))['_hex']) / 10**18

        if (eth_balance > 10) {

            await whale_signer.sendTransaction({
                to: addy,
                value: ethers.utils.parseEther("10")
            });
        }

        if (weth_balance > 1){

            await WETH_CONTRACT.transfer(addy, (BigInt(1)*BigInt(10**18)).toString(), {
                from: contracts['WETH'],
            });
        }
    }

    return [owner, WETH_CONTRACT];
}

async function deploy(){

    if (process.env.HARDHAT_NETWORK == 'localhost'){
        await perform_whale_transfer()
    }


    let ABI_STRING = ""

    for (const [key, value] of Object.entries(contracts)) {
        ABI_STRING = ABI_STRING + `export let ${key} = '${value}'\n`        
    }

    ABI_STRING = ABI_STRING + "\n"

    for (const [key, value] of Object.entries(abis)) {
        ABI_STRING = ABI_STRING + `export let ${key} = ${value}\n`        
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
            
            ABI_STRING = ABI_STRING + "export let " + var_name + "_ABI" + " = " + contents.replace(/\s/g, '') + "\n"           
        }
    })

    ABI_STRING = ABI_STRING + "\n\n"

    const VaultManager = await ethers.getContractFactory("VaultManager");
    let vm = await VaultManager.deploy(contracts['WETH']);
    await vm.deployed();  
    console.log("Vault Manager Contract Deployed at " + vm.address);

    ABI_STRING = ABI_STRING + "export let VAULT_MANAGER='" + vm.address + "'\n\n"

    fs.writeFileSync('src/config.js', ABI_STRING);   
}

if (require.main === module) {
    deploy()
}

module.exports.perform_whale_transfer = perform_whale_transfer;