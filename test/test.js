const { expect } = require("chai");
const { ethers } = require("hardhat");
const {perform_whale_transfer} =  require("../scripts/deploy.js")
const {WETH, NFTFI, NFTFI_COORDINATOR, NFTFI_NOTE, ERC20_ABI, ERC721_ABI} =  require("../src/config.js")
let owner;
let WETH_CONTRACT;
let vault;

describe('Contract tests', () => {

    before('Deploy Contract and Transfer Tokens', async () => {
        
        owner = await perform_whale_transfer();
        WETH_CONTRACT = await ethers.getContractAt(ERC20_ABI, WETH,  owner);

        const OracleManager = await ethers.getContractFactory("PepeFiOracle");
        or = await OracleManager.deploy(owner.address);
        await or.deployed();  

        const PepeAuction = await ethers.getContractFactory("PepeAuction");
        pe = await PepeAuction.deploy(WETH);
        await pe.deployed();  

        const VaultUtils = await ethers.getContractFactory("VaultUtils");
        vu = await VaultUtils.deploy(NFTFI,  NFTFI_COORDINATOR);
        await vu.deployed();  

        const VaultSkeleton = await ethers.getContractFactory("Vault");
        vs = await VaultSkeleton.deploy()
        await vs.deployed();  

        const VaultManager = await ethers.getContractFactory("VaultManager");
        vm = await VaultManager.deploy(WETH, NFTFI, NFTFI_COORDINATOR,  NFTFI_NOTE, or.address, pe.address, vu.address, vs.address);
        await vm.deployed();  

        let res = await vm.createVault('Test Vault', 1700695053, ['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', '0x42069abfe407c60cf4ae4112bedead391dba1cdb', '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6'], [500, 500, 400, 500], [450, 450, 450, 450], true, 0)
        await or.updatePrices(['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', '0x42069abfe407c60cf4ae4112bedead391dba1cdb', '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6'], ['76000000000000000000', '6000000000000000000', '3000000000000000000', '74000000000000000000'])
        

        let vaults = await vm.getAllVaults()

        const Vault = await ethers.getContractFactory("Vault");
        vault = await Vault.attach(vaults[0]);
          
    })

    

    it("Enough Balance to perform tests", async function () {
        let eth_balance = await owner.provider.getBalance(owner.address);
        expect(eth_balance / 10**18 ).to.greaterThan(100)

        let weth_balance = await WETH_CONTRACT.balanceOf(owner.address)
        expect(weth_balance / 10**18 ).to.greaterThan(0.1)
    })

    it("Verify Oracle Price", async function () {
        expect((await or.getPrice('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'))/10**18).to.equal(76)
        expect((await or.getPrice('0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b'))/10**18).to.equal(6)
        expect((await or.getPrice('0x42069abfe407c60cf4ae4112bedead391dba1cdb'))/10**18).to.equal(3)
        expect((await or.getPrice('0xb7f7f6c52f2e2fdb1963eab30438024864c313f6'))/10**18).to.equal(74)

    })

    it("Add Liquidity", async function () {
        amt = 10
        await WETH_CONTRACT.approve(vault.address, ethers.constants.MaxUint256);
        await vault.addLiquidity(amt);
        
        expect(await vault.balanceOf(owner.address, 0)).to.equal(amt);
        expect(parseInt(await WETH_CONTRACT.balanceOf(vault.address))).to.greaterThanOrEqual(parseInt(amt));
    })
    
    it("Take and Repay PNNFT Loan and verify liquidity addition", async function () {
        //first add ETH to liquidity pool
        await vault.addLiquidity((2*10**18).toString());

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

        //converting ID
        let loan = await NFT_CONTRACT.loans(NOTE)
        let TEST_CONTRACT = await ethers.getContractAt(ERC721_ABI, NFTFI_NOTE, owner);

        //approve contract to spend this nft
        await TEST_CONTRACT.approve(vault.address, NOTE)
        await vault.takePNNFILoan(loan['loanId'], '1000000000000000000', '1661438551'); //past time works as we are using old fork

        let loans = await vault.getAllLoans()
        expect(loans.length).to.greaterThanOrEqual(1)

        let curr_loan = loans[loans.length - 1]

        let loanDetails = await vault._loans(curr_loan)

        expect((loanDetails.repaymentAmount/10**18).toFixed(3)).to.be.oneOf(['1.001', '1.002']);
        expect(loanDetails.expirity).to.equal(1661438551);
        expect(loanDetails.loanPrincipalAmount).to.equal('1000000000000000000');

        expect(await vault.getWETHBalance()).to.equal("2000000000000000010") //run test on this here as there is active loan on + equity

        await WETH_CONTRACT.approve(vault.address, ethers.constants.MaxUint256);
        await vault.repayLoan(curr_loan)

        expect((await vault.getWETHBalance()/10**18).toFixed(3)).to.be.oneOf(['2.001', '2.002']);

    })

    it("Take and Repay ERC721 Loan", async function () {

        let IMPERSO = '0x1b523dc90a79cf5ee5d095825e586e33780f7188'

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [IMPERSO],
        });

        const nft_signer = await ethers.provider.getSigner(IMPERSO);
        let NFT_CONTRACT = await ethers.getContractAt(ERC721_ABI, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', nft_signer);
        
        let NOTE = "9036"

        if ((await NFT_CONTRACT.ownerOf(NOTE)).toLowerCase() == IMPERSO.toLowerCase())
        { 

            console.log("Transferring BAYC")
            await NFT_CONTRACT.transferFrom(IMPERSO, owner.address, NOTE, {
                from: IMPERSO,
            })
        }


        let TEST_CONTRACT = await ethers.getContractAt(ERC721_ABI, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', owner);

        await TEST_CONTRACT.approve(vault.address, NOTE)
        await vault.takeERC721Loan('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', NOTE, '1000000000000000000', '1661438551'); //past time works as we are using old fork

        let loans = await vault.getAllLoans()
        let curr_loan = loans[loans.length - 1]

        let loanDetails = await vault._loans(curr_loan)

        expect((loanDetails.repaymentAmount/10**18).toFixed(3)).to.be.oneOf(['1.001', '1.002']);
        expect(loanDetails.expirity).to.equal(1661438551);
        expect(loanDetails.loanPrincipalAmount).to.equal('1000000000000000000');

        await WETH_CONTRACT.approve(vault.address, ethers.constants.MaxUint256);
        await vault.repayLoan(curr_loan)

    })

    it("Expire Vault, and Withdraw Liquidity", async function () {
        //This function is purely for testing purpose and should be removed from mainnet deployment
        await vault.expireVault();
        await vault.withdrawLiquidity(10)

    })

})