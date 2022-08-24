const { expect } = require("chai");
const { ethers } = require("hardhat");
const {perform_whale_transfer} =  require("../scripts/deploy.js")
const {WETH, NFTFI, NFTFI_COORDINATOR, NFTFI_NOTE, SUDOSWAP_ROUTER, ERC20_ABI, ERC721_ABI} =  require("../src/config.js")
let owner;
let WETH_CONTRACT;
let vault;

describe('Contract tests', () => {

    before('Deploy Contract and Transfer Tokens', async () => {
        owner = await perform_whale_transfer();
        WETH_CONTRACT = await ethers.getContractAt(ERC20_ABI, WETH,  owner);

        const VaultManager = await ethers.getContractFactory("VaultManager");
        vm = await VaultManager.deploy(WETH, NFTFI, NFTFI_COORDINATOR,  NFTFI_NOTE, "0x2b2e8cda09bba9660dca5cb6233787738ad68329");
        await vm.deployed();  

        const Vault = await ethers.getContractFactory("Vault");
        vault = await Vault.deploy('Test Vault', vm.address, 1700695053, ['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', '0x42069abfe407c60cf4ae4112bedead391dba1cdb', '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6'], [500, 500, 400, 500], 4500, true)
        await vault.deployed();  

    })


    it("Enough Balance to perform tests", async function () {
        let eth_balance = await owner.provider.getBalance(owner.address);
        expect(eth_balance / 10**18 ).to.greaterThan(100)

        let weth_balance = await WETH_CONTRACT.balanceOf(owner.address)
        expect(weth_balance / 10**18 ).to.greaterThan(0.1)
    })

    it("Deploying vault", async function (){
        let deployment = await vm.createVault('Test Vault', 1700695053, ['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', '0x42069abfe407c60cf4ae4112bedead391dba1cdb', '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6'], [500, 500, 400, 500], 4500, true, 0)
        let vaults = await vm.getAllVaults()
        expect(vaults.length).to.greaterThanOrEqual(1)
    })

    it("Add Liquidity", async function () {
        amt = 10
        await WETH_CONTRACT.approve(vault.address, ethers.constants.MaxUint256);
        await vault.addLiquidity(amt);
        
        expect(await vault.balanceOf(owner.address, 0)).to.equal(amt);
        expect(parseInt(await WETH_CONTRACT.balanceOf(vault.address))).to.greaterThanOrEqual(parseInt(amt));
    })
    
    it("Take and Repay Loan", async function () {
        let IMPERSO = '0xC6a6f43d5D52C855EBE1f825C717937A7b901732'

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [IMPERSO],
        });

        const nft_signer = await ethers.provider.getSigner(IMPERSO);
        let NFT_CONTRACT = await ethers.getContractAt(ERC721_ABI, NFTFI_NOTE, nft_signer);
        
        let NOTE = "14358716824499463741"
        if ((await NFT_CONTRACT.ownerOf(NOTE)).toLowerCase() == IMPERSO.toLowerCase())
        { 

            //convert loanId to 14358716824499463741
            console.log("Transferring CloneX")
            await NFT_CONTRACT.transferFrom(IMPERSO, owner.address, NOTE, {
                from: IMPERSO,
            })
        }

        let loan = await NFT_CONTRACT.loans(NOTE)
        //use abi to convert this
        await vault.takePNNFILoan(loan['loanId']);

    })
})