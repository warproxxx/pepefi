import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

import {store} from '../app/store'
import {
    setWallets,
    setNetwork,
    setAccount,
    setChainId,
    setError,
} from '../redux/walletsSlice';


const wallets = store.getState().wallets;
const dispatch = store.dispatch;
const providerOptions = {
    walletlink: {
        package: CoinbaseWalletSDK, // Required
        options: {
        appName: "Web 3 Modal Demo", // Required
        infuraId: process.env.INFURA_KEY // Required unless you provide a JSON RPC url; see `rpc` below
        }
    },
    walletconnect: {
        package: WalletConnect, // required
        options: {
        infuraId: process.env.INFURA_KEY // required
        }
    }
};

let web3Modal = null;


export const web3ModalSetup = () => {
    web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
        theme: {
            background: "#121218",
            main: "#ffffff",
            secondary: "rgb(136, 136, 136)",
            border: "rgba(195, 195, 195, 0.14)",
            hover: "#1B1B21"
        }
    });
    return web3Modal;
}

const connectWallet = async () => {
    try {
        const provider = await web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        const accounts = await library.listAccounts();
        const network = await library.getNetwork();
        const signer = await library?.getSigner();
        let chainId = 0;
        let account = ""
        if (accounts) {
            account = accounts[0]
            chainId = network.chainId;
            let wallets = {
                provider,library,accounts,network,chainId,account,signer
            }
            dispatch(setWallets(wallets))
            return true;

            
        }
    } 
    catch (error) {
        dispatch(setError(error));
        console.error(error)
        return false;
    }
};

const handleNetwork = (e) => {
    const id = e.target.value;
    dispatch(setNetwork(Number(id)));
};

const switchNetwork = async () => {
    try {
        await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
        });
    } catch (switchError) {
        if (switchError.code === 4902) {
        try {
            await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
            });
        } catch (error) {
            setError(error);
            console.error(error)
        }
        }
    }
};

const refreshState = () => {
    dispatch(setAccount(""));
    dispatch(setChainId(0));
    dispatch(setNetwork(""));
};

export const disconnect = async () => {
    try{
        await web3Modal.clearCachedProvider();
        refreshState();
        return true;
    }
    catch(error){
        console.error(error)
        return false;
    }

};



export const web3ModalHelper = {web3Modal,connectWallet,handleNetwork,switchNetwork,disconnect};
