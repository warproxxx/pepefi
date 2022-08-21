const { expect } = require("chai");
const { ethers } = require("hardhat");

let ERC20_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
let WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

let weth_contract = new ethers.Contract(WETH_ADDY,ERC20_ABI);

describe('Contract tests', () => {

    before('Deploy Contract and Transfer Tokens', async () => {
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [WETH],
        });

        //get signer
        [owner] = await ethers.getSigners();

        //Deploy the contracts
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vm = await Liquidity.deploy(WETH);
        await vm.deployed();  


        await vm.setBetContract(bet.address);
        const whale_signer = await ethers.provider.getSigner(WETH);

        let WETH_CONTRACT= await ethers.getContractAt(ERC20_ABI, DAI_ADDY, whale_signer);
        const FUND_AMOUNT = (BigInt(30000)*BigInt(10**18)).toString()
        await WETH_CONTRACT.transfer(owner.address, FUND_AMOUNT, {
            from: WETH,
            });

        await whale_signer.sendTransaction({
            to: owner.address,
            value: ethers.utils.parseEther("1")
        });
    })

})