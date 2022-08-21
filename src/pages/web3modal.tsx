import React from 'react';
import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import {Button,Box,Grid,} from "@mui/material";
import { AddVaultPopup } from "src/components/Vaults/AddVaultPopup";
import { VaultCard } from "src/components/Vaults/VaultCard";
import { VaultDetailsPopup } from "src/components/Vaults/VaultDetailsPopup";
import {styled, experimental_sx as sx} from '@mui/system';
import Image from 'next/image';
import {useEffect,useState} from 'react'

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

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

const truncateAddress = (address) => {
    if (!address) return "No Account";
    const match = address.match(
      /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};
  
const toHex = (num) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};
  


function IndexPage(props:any) {
    const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });


    const [provider, setProvider] = useState();
    const [library, setLibrary] = useState();
    const [account, setAccount] = useState();
    const [signature, setSignature] = useState("");
    const [error, setError] = useState("");
    const [chainId, setChainId] = useState();
    const [network, setNetwork] = useState();
    const [message, setMessage] = useState("");
    const [signedMessage, setSignedMessage] = useState("");
    const [verified, setVerified] = useState();

    const connectWallet = async () => {
        try {
            const provider = await web3Modal.connect();
            const library = new ethers.providers.Web3Provider(provider);
            const accounts = await library.listAccounts();
            const network = await library.getNetwork();
            setProvider(provider);
            setLibrary(library);
            if (accounts) setAccount(accounts[0]);
            setChainId(network.chainId);
            } catch (error) {
            setError(error);
            }
    };

    const handleNetwork = (e) => {
        const id = e.target.value;
        setNetwork(Number(id));
    };
    
    const handleInput = (e) => {
        const msg = e.target.value;
        setMessage(msg);
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
            }
          }
        }
    };

    const refreshState = () => {
    setAccount();
    setChainId();
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
    };

    const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
    };
        
    useEffect(() => {
    if (web3Modal.cachedProvider) {
        connectWallet();
    }
    }, []);

    useEffect(() => {
    if (provider?.on) {
        const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
        };

        const handleChainChanged = (_hexChainId) => {
        setChainId(_hexChainId);
        };

        const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
        };

        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);

        return () => {
        if (provider.removeListener) {
            provider.removeListener("accountsChanged", handleAccountsChanged);
            provider.removeListener("chainChanged", handleChainChanged);
            provider.removeListener("disconnect", handleDisconnect);
        }
        };
    }
    }, [provider]);

  return (
    <>
      <Head>
        <title>
          PepeFi | Vaults
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          display:'flex',
          py: 8,
          paddingLeft:{xs:'16px',sm:'24px'},
          paddingRight:{xs:'16px',sm:'24px'},
          // width:{xs:'100%',md:'80%'},maxWidth:'1400px !important',
          justifyContent: 'center',
          flexDirection:'column',
          alignItems: 'center',
          gap:'20px'
        }}
      >
      <Button onClick={()=>{connectWallet();}} variant="contained">REAL connect button</Button>
      <Button onClick={()=>{disconnect();}} variant="contained">REAL disconnect button</Button>
      <p style={{color:'white'}}>{`Connection Status: ${account ? 'good' : 'bad'}`}</p>
      <p style={{color:'white'}}>{`Account: ${truncateAddress(account)}`}</p>
      <p style={{color:'white'}}>{`Network ID: ${chainId ? chainId : "No Network"}`}</p>
      
      </Box>
    </>

  );
}

IndexPage.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default IndexPage;