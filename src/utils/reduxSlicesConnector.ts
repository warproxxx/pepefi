import { web3ModalHelper } from "./web3ModalFunctions";
import {store} from '../app/store'
import { setWallets } from "src/redux/walletsSlice";
import { setMyLoans,clearMyLoans } from "src/redux/myLoansSlice";
import { setLoans,clearLoans } from "src/redux/loansSlice";

import { loans as fake_data_loans } from "src/data/loans";
import { myLoans as fake_data_myLoans } from "src/data/myLoans";

const dispatch = store.dispatch;
const wallets = store.getState().wallets;
const myLoans = store.getState().myLoans;
const loans = store.getState().loans;

const connectWallet = web3ModalHelper.connectWallet;
const disconnect = web3ModalHelper.disconnect

export const connectWalletAndGetData = async () => {
    let connectSuccess = await connectWallet();
    
    if(!connectSuccess)
        return

    //  Get both NFTs and Loans here after the user is logged in
    //  For example:

    //  import getUserNFTs from contractFunctions
    //  userNFTs = await getUserNfTs;
    //  dispatch(setLoans(userNFTs));

    //  import getUserLoans from contractFunctions
    //  userLoans = await getUserLoans;
    //  dispatch(setMyLoans(userLoans));

    dispatch(setLoans(fake_data_loans));
    dispatch(setMyLoans(fake_data_myLoans));
}

export const disconnectAndClearData = async () =>{
    let disconnectSuccess = await disconnect();

    if(!disconnectSuccess)
        return
    
    dispatch(clearLoans());
    dispatch(clearMyLoans());
}
