import { store } from "../app/store";
import { ethers } from "ethers";
import {ACCEPTED_COLLECTIONS, PEPEAUCTION_ABI, PEPEFIORACLE_ABI, VAULT_ABI, VAULTMANAGER_ABI, VAULTUTILS_ABI, ORACLE_CONTRACT, VAULT_MANAGER, WETH, ERC20_ABI} from "../config"
const axios = require('axios')

export const showWallets = () => {
    console.log(wallets);
}

export const contractStuff = () => {

}

async function approve_and_spend(addy, abi, signer){
    let provider = signer.provider;
    let contract = new ethers.Contract( addy, abi, signer )
    let x = await contract.allowance(provider.address, nftfi)

    if (x < 10**18 * 1000){
        await contract.approve(addy, ethers.constants.MaxUint256)
    }
}

function getCollectionDetails(coll) {
    for (let row of ACCEPTED_COLLECTIONS){
        if (row['address'].toLowerCase() == coll.toLowerCase()){
            return row;
        }
    }
}

export const getAllVaults = async () => {
    let wallets = store.getState().wallets;
    let signer = wallets.library.getSigner()

    let weth_contract = new ethers.Contract( WETH , ERC20_ABI , signer)
    let vm = new ethers.Contract( VAULT_MANAGER , VAULTMANAGER_ABI , signer)
    let oracle = new ethers.Contract(ORACLE_CONTRACT, PEPEFIORACLE_ABI, signer)
    
    let vaults = await vm.getAllVaults()
    
    let allVaults = []

    for (let vault of vaults){
        let contract = new ethers.Contract( vault , VAULT_ABI , signer)
        
        let curr = {}
        curr['name'] = await contract.VAULT_NAME()
        curr['contractAddy'] = vault
        curr['totalWETH'] = await weth_contract.balanceOf(vault)

        curr['duration'] = await contract.expirityDate()

        let [collections, ltvs, aprs] = await contract.getVaultDetails()

        let collection_wise = []
        let i = 0

        for (let collection of collections){
            let details = getCollectionDetails(collection)


            let coll_details = {}
            coll_details['name'] = details['name']
            coll_details['imgSrc'] = details['imgSrc']
            coll_details['openseaSrc'] = 'https://opensea.io/collection/' + details['slug']

            coll_details['etherScanSrc'] = 'etherscan.io/address/' + collection

            coll_details['oraclePrice'] = await oracle.getPrice(collection)

            let open = await axios.get(`https://api.opensea.io/api/v1/collection/${details['slug']}/stats`)
            coll_details['openseaPrice'] = open['data']['stats']['floor_price']

            coll_details['LTV'] = ltvs[i]
            coll_details['APR'] = aprs[i]

            collection_wise.push(coll_details)

            i = i + 1
        }

        curr['collections'] = collection_wise

        allVaults.push(curr)
    }

    // console.log(allVaults)
    return allVaults
}

export const addVault = async (details) => {
    let wallets = store.getState().wallets;
    let signer = wallets.library.getSigner()

    let vm = new ethers.Contract( VAULT_MANAGER , VAULTMANAGER_ABI , signer)

    if (details.initialVaultDeposit > 0){
        await approve_and_spend(WETH, ERC20_ABI, signer)
    }

    
    let addy = await vm.createVault(details.vaultName, new Date((details.expiredDate)).getTime() / 1000, details.collectionsAddressArray, details.collectionsLTVArray, details.collectionsAPRArray, details.allowExternalLP, details.initialVaultDeposit)
    return addy
}

export const asyncContractStuff = async() => {
    //await ...
}