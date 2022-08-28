import { store } from "../app/store";
import { ethers } from "ethers";
import {ACCEPTED_COLLECTIONS, PEPEAUCTION_ABI, PEPEFIORACLE_ABI, VAULT_ABI, VAULTMANAGER_ABI, VAULTUTILS_ABI, ORACLE_CONTRACT, VAULT_MANAGER, WETH, ERC20_ABI, ERC721_ABI} from "../config"
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

export const getLoans = async () => {
    console.log(store.getState().wallets)

    //hardcoding as there is no easy way to get this data locally. In rinkeby alchemy API is used
    let wallets = store.getState().wallets;
    const { chainId } = await wallets.library.getNetwork()
    let signer = wallets.library.getSigner()

    let all_loans = []

    //local needs static as there is no easy way
    if (chainId == 1337){
        let toCheck = [{
            openseaSrc: 'https://opensea.io/assets/ethereum/0x5660e206496808f7b5cdb8c56a696a96ae5e9b23/12699013038842394238',
            collection: 'NFTFi',
            name: 'NFTFi Loan #9431',
            imgSrc: 'https://api.nftfi.com/loans/v2/promissory/image/1/12699013038842394238',
            collection: '0x5660e206496808f7b5cdb8c56a696a96ae5e9b23',
            id: '12699013038842394238'
        }, 
        {
            openseaSrc: 'https://opensea.io/assets/ethereum/0x5660e206496808f7b5cdb8c56a696a96ae5e9b23/14103957916149294123',
            collection: 'NFTFi',
            name: 'NFTFi Loan #9428',
            imgSrc: 'https://api.nftfi.com/loans/v2/promissory/image/1/14103957916149294123',
            collection: '0x5660e206496808f7b5cdb8c56a696a96ae5e9b23',
            id: '14103957916149294123'
        },
        {
            openseaSrc: 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9036',
            collection: 'Bored Ape Yacht Club',
            name: 'Bored Ape Yacht Club #9036',
            imgSrc: 'https://img.seadn.io/files/6169c844af4366bc3fb72fb414fd2225.png?fit=max&w=600',
            collection: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
            id: '9036'
        },
        {
            openseaSrc: 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9547',
            collection: 'Bored Ape Yacht Club',
            name: 'Bored Ape Yacht Club #9547',
            imgSrc: 'https://img.seadn.io/files/6169c844af4366bc3fb72fb414fd2225.png?fit=max&w=600',
            collection: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
            id: '9547'
        }
    ]   


        for (let curr of toCheck){
            let NFT_CONTRACT = new ethers.Contract(curr['collection'], ERC721_ABI,  signer);

            if ((await NFT_CONTRACT.ownerOf(curr['id'])).toLowerCase() == wallets.account.toLowerCase()){
                all_loans.push(curr)
            }

        }

    }
    else if (chainId == 4){
        baseURL = `https://eth-rinkeby.alchemyapi.io`;
        let url = `${baseURL}/nft/v2/${apiKey}/getNFTs/?owner=${wallets.account}&contractAddresses[]=0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b`;
        let response = await axios.get(url);

        let collections = response.data['ownedNfts']

        let curr

        while ('pageKey' in response.data){
            url = `${baseURL}/nft/v2/${apiKey}/getNFTs/?owner=${wallets.account}&contractAddresses[]=0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b`;
            curr = await axios.get(url);
            collections.push(curr.data)
        }

        

        for (let collection of collections){
            let id = collection['title'].split(" ")[2].replace("#", "")

            let curr = {
                openseaSrc: `https://testnets.opensea.io/assets/rinkeby/0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b/${id}`,
                collection: 'Multifaucet NFT',
                name: collection['title'],
                imgSrc: 'https://ipfs.io/ipfs/bafybeifvwitulq6elvka2hoqhwixfhgb42l4aiukmtrw335osetikviuuu',
                collection: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
                id: id
            }

            all_loans.push(curr)

        }
    }

    return all_loans

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