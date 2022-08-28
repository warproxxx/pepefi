import { store } from "../app/store";
import { ethers } from "ethers";
import {ACCEPTED_COLLECTIONS, PEPEAUCTION_ABI, PEPEFIORACLE_ABI, VAULT_ABI, VAULTMANAGER_ABI, VAULTUTILS_ABI, ORACLE_CONTRACT, VAULT_MANAGER, WETH, ERC20_ABI, ERC721_ABI} from "../config"
const axios = require('axios')
import { FetchWrapper } from "use-nft"

async function approve_and_spend(target_address, abi, signer){
    let user_address = await signer.getAddress( )

    let contract = new ethers.Contract( WETH, abi, signer )
    let x = await contract.allowance(user_address, target_address)

    if (x < 10**18 * 1000){
        await contract.approve(target_address, ethers.constants.MaxUint256)
    }
}

async function getCollectionDetails(coll) {
    for (let row of ACCEPTED_COLLECTIONS){
        if (row['address'].toLowerCase() == coll.toLowerCase()){
            return row;
        }
    }
}

export const getAssets = async () => {
    console.log(store.getState().wallets)

    //hardcoding as there is no easy way to get this data locally. In rinkeby alchemy API is used
    let wallets = store.getState().wallets;
    const { chainId } = await wallets.library.getNetwork()
    let signer = wallets.library.getSigner()

    let all_loans = []

    //local needs static as there is no easy way
    if (chainId == 1337){
        let toCheck = [
            {
                openseaSrc: 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9036',
                collection: 'Bored Ape Yacht Club',
                name: '#9036',
                imgSrc: 'https://img.seadn.io/files/6169c844af4366bc3fb72fb414fd2225.png?fit=max&w=600',
                address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
                id: '9036'
            },
            {
                openseaSrc: 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9547',
                collection: 'Bored Ape Yacht Club',
                name: '#9547',
                imgSrc: 'https://img.seadn.io/files/6169c844af4366bc3fb72fb414fd2225.png?fit=max&w=600',
                address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
                id: '9547'
            },    
            
        {
            openseaSrc: 'https://opensea.io/assets/ethereum/0x5660e206496808f7b5cdb8c56a696a96ae5e9b23/12699013038842394238',
            collection: 'NFTFi Loan',
            name: '#2192',
            imgSrc: 'https://api.nftfi.com/loans/v2/promissory/image/1/12699013038842394238',
            address: '0x5660e206496808f7b5cdb8c56a696a96ae5e9b23',
            id: '12699013038842394238'
        }, 
        {
            openseaSrc: 'https://opensea.io/assets/ethereum/0x5660e206496808f7b5cdb8c56a696a96ae5e9b23/14103957916149294123',
            collection: 'NFTFi Loan',
            name: '#2317',
            imgSrc: 'https://api.nftfi.com/loans/v2/promissory/image/1/14103957916149294123',
            address: '0x5660e206496808f7b5cdb8c56a696a96ae5e9b23',
            id: '14103957916149294123'
        }
    ]   


        for (let curr of toCheck){
            let NFT_CONTRACT = new ethers.Contract(curr['address'], ERC721_ABI,  signer);

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

export const repayLoan = async (details) => {
    let wallets = store.getState().wallets;
    let signer = wallets.library.getSigner()

    await approve_and_spend(details.vault, ERC20_ABI, signer)

    let vault = new ethers.Contract( details.vault , VAULT_ABI , signer)
    await vault.repayLoan(details.id)
}

export const addLiquidity = async (amount, vault) => {
    console.log(amount, vault)

    let wallets = store.getState().wallets;
    let signer = wallets.library.getSigner()

    await approve_and_spend(vault, ERC20_ABI, signer)    

    let exactAmt = ethers.utils.parseUnits(String(amount), "ether");
    

    let vault_contract = new ethers.Contract( vault , VAULT_ABI , signer)
    await vault_contract.addLiquidity(exactAmt)
}

export const getAllLoans = async () => {
    let wallets = store.getState().wallets;
    let signer = wallets.library.getSigner()

    let vm = new ethers.Contract( VAULT_MANAGER , VAULTMANAGER_ABI , signer)
    let vaults = await vm.getAllVaults()

    const fetcher = ["ethers", { provider: wallets.library }]
    const fetchWrapper = new FetchWrapper(fetcher)
    let all_loans = []

    for (let vault of vaults){
        let vault_contract = new ethers.Contract( vault , VAULT_ABI , signer)
        let loans = await vault_contract.getAllLoans()

        for (let loan of loans){
            
            let loanDetails = await vault_contract._loans(loan)

            let details = await getCollectionDetails(loanDetails['collateral'])
            let curr_details = {}

            if (loanDetails.smartNftId == 0){
                let result = await fetchWrapper.fetchNft(
                    loanDetails.collateral,
                    loanDetails.assetId
                  )
    
                
                curr_details['imgSrc'] = result.image;
            }
            else{
                curr_details['imgSrc'] = `https://api.nftfi.com/loans/v2/promissory/image/1/${loanDetails.smartNftId}`;
            }

        
            
            curr_details['name'] = details['name']
            curr_details['collection'] = details['id']
            curr_details['lendedVault'] = vault
            
            loan_duration = (loanDetails.expirity - loanDetails.timestamp)/86400

            curr_details['APR'] = (((loanDetails.repaymentAmount - loanDetails.loanPrincipalAmount)/loanDetails.loanPrincipalAmount)/loan_duration) * 365 * 100
            curr_details['loanAmount'] = loanDetails['loanPrincipalAmount'] / 10**18
            curr_details['loanDate'] = new Date(loanDetails.timestamp * 1000); 
            curr_details['remainingDays'] = loan_duration
            curr_details['repaymentAmount'] = loanDetails['repaymentAmount'] / 10**18
            curr_details['action'] = loanDetails['name']

            all_loans.push(curr_details)
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
            console.log(collection)
            let details = await getCollectionDetails(collection)

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

export const takeLoan = async (details) => {
    let wallets = store.getState().wallets;
    let signer = wallets.library.getSigner()

    let NFT_CONTRACT = new ethers.Contract(details.collection, ERC721_ABI,  signer);
    await NFT_CONTRACT.approve(details.vault, details.id)

    let contracts = ['0x5660e206496808f7b5cdb8c56a696a96ae5e9b23', '0x33e75763F3705252775C5AEEd92E5B4987622f44']

    if(contracts.includes(details.collection)){
        await vault.takePNNFILoan(details.loanId, details.loanPrincipal, details.repaymentDay);
    } else {
        await vault.takeERC721Loan(details.collection, details.id, details.loanPrincipal, details.repaymentDay); //past time works as we are using old fork
    }

}