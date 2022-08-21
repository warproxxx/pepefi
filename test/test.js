const { expect } = require("chai");
const { ethers } = require("hardhat");
const {perform_whale_transfer} =  require("../scripts/deploy.js")


let ERC20_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
let WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
let owner;
let WETH_CONTRACT;
let vm;

describe('Contract tests', () => {

    before('Deploy Contract and Transfer Tokens', async () => {
        [owner, WETH_CONTRACT] = await perform_whale_transfer();

        const VaultManager = await ethers.getContractFactory("VaultManager");
        vm = await VaultManager.deploy(WETH);
        await vm.deployed();  
        
    })


    it("Enough Balance to perform tests", async function () {
        let eth_balance = await owner.provider.getBalance(owner.address);
        expect(eth_balance / 10**18 ).to.greaterThan(100)

        let weth_balance = await WETH_CONTRACT.balanceOf(owner.address)
        expect(weth_balance / 10**18 ).to.greaterThan(0.1)

    })

    it("Deploy Vault", async function (){
        let deployment = await vm.createVault('Initial Vault', ['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', '0x42069abfe407c60cf4ae4112bedead391dba1cdb'], [500, 500, 400], 4500, true, 0)
        let res = await deployment.wait()
    })

})