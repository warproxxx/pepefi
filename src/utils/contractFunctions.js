import { store } from "../app/store";
import { ethers } from "ethers";
import {PEPEAUCTION_ABI, PEPEFIORACLE_ABI, VAULT_ABI, VAULTMANAGER_ABI, VAULTUTILS_ABI, ORACLE_CONTRACT, VAULT_MANAGER, WETH, ERC20_ABI} from "../config"

let wallets = store.getState().wallets;
let signer = store.getState().wallets.signer;
let provider = signer.provider;
export const showWallets = () => {
    console.log(wallets);
}

export const contractStuff = () => {

}

async function approve_and_spend(addy, abi, signer){
    let contract = new ethers.Contract( addy, abi, signer )
    let x = await contract.allowance(provider.address, nftfi)

    if (x < 10**18 * 1000){
        await contract.approve(addy, ethers.constants.MaxUint256)
    }
}

export const addVault = async (details) => {
    let vm = new ethers.Contract( VAULT_MANAGER , VAULTMANAGER_ABI , signer )

    if (details.initialVaultDeposit > 0){
        await approve_and_spend(WETH, ERC20_ABI, signer)
    }

    
    let addy = await vm.createVault(details.vaultName, new Date((details.expiredDate)).getTime() / 1000, details.collectionsAddressArray, details.collectionsLTVArray, details.collectionsAPRArray, details.allowExternalLP, details.initialVaultDeposit)
    console.log(addy)
}

export const asyncContractStuff = async() => {
    //await ...
}