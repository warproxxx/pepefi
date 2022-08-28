import { web3ModalHelper } from "./web3ModalFunctions";
import {store} from '../app/store'
import { setWallets } from "src/redux/walletsSlice";
import { setMyLoans,clearMyLoans } from "src/redux/myLoansSlice";
import { setLoans,clearLoans } from "src/redux/loansSlice";
import { setSelectedVault, setVaults } from "src/redux/vaultsSlice";
import { setLendingNFT } from "src/redux/lendingNFTSlice";

import { loans as fake_data_loans } from "src/data/loans";
import { myLoans as fake_data_myLoans } from "src/data/myLoans";
import { vaults as fake_data_vaults } from "src/data/vaults";

import {/*getUserNFTs,getUserLoans,*/getAllVaults, getAssets, getAllLoans, getNFTDetails, getRepayment} from "src/utils/contractFunctions"

const dispatch = store.dispatch;
const wallets = store.getState().wallets;

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
    console.log('assets',assets)
    let full_data = []
    full_data['selectedNFTIndex'] = 0
    full_data['allNFTs'] = assets

    console.log(full_data)

    dispatch(setLoans(full_data));
}

export const getAndSetLendingNFT = (clickedNFTIndex) =>{
    let loans = store.getState().loans;
    // let avaliableVaults = []
    let lendingNFT = loans.allNFTs[clickedNFTIndex];
    // vaults.map((vault,index)=>{
    //     vault.collections.map((collection,index)=>{
    //         if(collection.name == lendingNFT.collection){
    //             avaliableVaults.push({APR:collection.APR,duration:collection.duration,LTV:collection.LTV,name:vault.name})
    //         }
    //     })
    // })
    let temp_lendingNFT = {...lendingNFT};
    let valuation = temp_lendingNFT.oraclePrice / 10**18;
    let LTV = temp_lendingNFT.vaults[0].LTV;
    let APR = temp_lendingNFT.vaults[0].APR;
    let loanAmountMin = 0.01;
    let loanAmount = loanAmountMin;
    let duration = 10;
    temp_lendingNFT.valuation = valuation;
    let temp_vaults =  []
    temp_lendingNFT.vaults.map((vault,index)=>{
        let diffTime = new Date(Number(vault.duration * 1000)) - new Date();
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        temp_vaults.push(
            {
                ...vault,
                durationInDays: diffDays
            }
        )

    })
    temp_lendingNFT.vaults = temp_vaults;
    temp_lendingNFT.duration = temp_vaults[0].durationInDays;
    temp_lendingNFT.loanAmountMin = loanAmountMin;
    temp_lendingNFT.loanAmountMax = valuation * (LTV/1000);
    temp_lendingNFT.loanAmountSliderStep = loanAmountMin;
    temp_lendingNFT.loanAmount = loanAmountMin;
    temp_lendingNFT.repayment = Number(getRepayment(loanAmount,duration,APR)).toFixed(3)
    temp_lendingNFT.repaymentDate =new Date(Number(temp_lendingNFT.vaults[0].duration * 1000)) .toLocaleDateString();
    temp_lendingNFT.selectedValutIndex = 1;
    temp_lendingNFT.avaliableVaultsStrs = []

    temp_lendingNFT.vaults.map((vault)=>{
        console.log(vault)
        temp_lendingNFT.avaliableVaultsStrs.push(`${vault.name} (${vault.APR/10}% APR /  ${vault.LTV/10}% LTV / ${vault.durationInDays} days) `)
    })
    console.log(temp_lendingNFT)
    dispatch(setLendingNFT(temp_lendingNFT))
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
            totalWETH: vault.totalWETH,
            supplied_shares: vault.supplied_shares,
            weth_value: vault.weth_value,
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


