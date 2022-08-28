import { web3ModalHelper } from "./web3ModalFunctions";
import {store} from '../app/store'
import { setWallets } from "src/redux/walletsSlice";
import { setMyLoans,clearMyLoans } from "src/redux/myLoansSlice";
import { setLoans,clearLoans } from "src/redux/loansSlice";
import { setSelectedVault, setVaults } from "src/redux/vaultsSlice";

import { loans as fake_data_loans } from "src/data/loans";
import { myLoans as fake_data_myLoans } from "src/data/myLoans";
import { vaults as fake_data_vaults } from "src/data/vaults";

import {/*getUserNFTs,getUserLoans,*/getAllVaults, getAssets, getAllLoans} from "src/utils/contractFunctions"

const dispatch = store.dispatch;
const wallets = store.getState().wallets;
const myLoans = store.getState().myLoans;
const loans = store.getState().loans;

const connectWallet = web3ModalHelper.connectWallet;
const disconnect = web3ModalHelper.disconnect
export const connectWalletAndGetData = async () => {
    let connectSuccess = await connectWallet();
    
    if(!connectSuccess)
        return false;

    //  Get both NFTs and Loans here after the user is logged in
    //  For example:

    //  import getUserNFTs from contractFunctions
    //  userNFTs = await getUserNfTs();
    //  dispatch(setLoans(userNFTs));

    //  import getUserLoans from contractFunctions
    //  userLoans = await getUserLoans();
    //  dispatch(setMyLoans(userLoans));

    return true;
}

export const disconnectAndClearData = async () =>{
    let disconnectSuccess = await disconnect();

    if(!disconnectSuccess)
        return
    
    dispatch(clearLoans());
    dispatch(clearMyLoans());
}


const averageFunc = array => array.reduce((a, b) => a + b) / array.length;

const getCollectionsMinAndMaxAndAverage = (collections,duration) =>{
    let min = {
        APR: Number.MAX_VALUE,
        LTV: Number.MAX_VALUE,
    }

    let max = {
        APR: -1,
        LTV: -1,
    }

    let average = {
        APR: 0,
        LTV: 0,
    }

    let collectionImgSrcs = [];
    let openseaPrices = [];
    let oraclePrices = [];
    collections.map((collection)=>{
        collection.APR = collection.APR / 10;
        collection.LTV = collection.LTV / 10;
        Object.keys(min).map((key)=>{
            if(collection[key] < min[key]){  
                min[key] = collection[key]
            }
            if(collection[key] > max[key]){
                max[key] = collection[key]
            }
        })
        average.APR += collection.APR
        average.LTV += collection.LTV
        openseaPrices.push(collection.openseaPrice);
        oraclePrices.push(collection.oraclePrice / 10**18);
        collectionImgSrcs.push(collection.imgSrc)
        collection.NFTs= [
            {
                imgSrc: collection.imgSrc,
                openseaSrc: '',
                etherScanSrc: '',
                value: 55,
                duration: 30,
                APR: 10,
                loanAmount: 20
            }
        ],
        collection.oraclePrice = collection.oraclePrice / 10**18;
        collection.totalWETH = collection.NFTs.reduce((accumulator, object) => {
            return accumulator + object.value;
        }, 0);
        collection.duration = duration;
    })

    average.APR = average.APR / collections.length;
    average.LTV = average.LTV / collections.length;
    console.log('oraclePrices',oraclePrices)
    let openseaPrice = averageFunc(openseaPrices);
    let oraclePrice = averageFunc(oraclePrices);

    return({min,max,average,collectionImgSrcs,openseaPrice,oraclePrice})
}

export const getAndSetMyLoans = async () => {
    let all_loans = await getAllLoans();
    console.log("xx")
    dispatch(setMyLoans(all_loans));

}


export const getAndSetAssets = async () => {
    const assets = await getAssets();
    let full_data = []
    full_data['selectedNFTIndex'] = 0
    full_data['allNFTs'] = assets

    console.log(full_data)

    dispatch(setLoans(full_data));

}

export const getAndSetVaults = async () =>{
    const allVaults = await getAllVaults();
    console.log(allVaults);
    allVaults.map((vault)=>{
        let diffTime = new Date(Number(vault.duration * 1000)) - new Date();
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        let collectionStats = getCollectionsMinAndMaxAndAverage(vault.collections,diffDays);
        let collectionsMin = collectionStats.min;
        let collectionsMax = collectionStats.max;
        let collectionAverage = collectionStats.average;
        let collectionImgSrcs = collectionStats.collectionImgSrcs;
        let openseaPrice = collectionStats.openseaPrice;
        let oraclePrice = collectionStats.oraclePrice;
        vault['data'] = {
            totalWETH: vault.totalWETH.toNumber(),
            duration: diffDays,
            LTV: {
                range: [collectionsMin.LTV,collectionsMax.LTV],
                average: collectionAverage.LTV,
                min: collectionsMin.LTV / 1.5,
                max: collectionsMax.LTV * 1.5 > 100 ? 100 : collectionsMax.LTV * 1.5,
                marks: {
                  value: 0,
                  label: '',
                }
            },
            APR: {
              range: [collectionsMin.APR,collectionsMax.APR],
              average: collectionAverage.APR,
              min: collectionsMin.APR / 1.5,
              max: collectionsMax.APR * 1.5 > 1000 ? 1000 : collectionsMax.APR * 1.5,
              marks: {
                value: 0,
                label: '',
              }
            },
            openseaPrice: openseaPrice,
            oraclePrice: oraclePrice,
            imgSrc: collectionImgSrcs,
        }
        vault.etherScanSrc = `https://etherscan.io/address/${vault.contractAddy}`
        vault.data.LTV.marks = [
            {
                value: vault.data.LTV.range[0],
                label: `${vault.data.LTV.range[0]}%`
            },
            {
                value: vault.data.LTV.average,
                label: `${vault.data.LTV.average}%`
            },
            {
                value: vault.data.LTV.range[1],
                label: `${vault.data.LTV.range[1]}%`
            }
        ]
        vault.data.APR.marks = [
            {
                value: vault.data.APR.range[0],
                label: `${vault.data.APR.range[0]}%`
            },
            {
                value: vault.data.APR.average,
                label: `${vault.data.APR.average}%`
            },
            {
                value: vault.data.APR.range[1],
                label: `${vault.data.APR.range[1]}%`
            }
        ]
        console.log(vault);
    })
    dispatch(setVaults(
        {
            selectedVault: -1,
            allVaults: allVaults
        }
    ))

}


