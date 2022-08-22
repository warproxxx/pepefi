import React,{useEffect,useState} from 'react';

import Head from 'next/head'

import { Provider } from 'react-redux';
import { store } from 'src/app/store';

import NextNProgress from "nextjs-progressbar";
import { CssBaseline } from "@mui/material";

import { theme } from "src/styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { CircularProgress,Box } from '@mui/material';
import { createEmotionCache } from "../utils/create-emotion-cache";

import {
  setAccount,
  setChainId,
} from '../redux/walletsSlice';
import {web3ModalHelper,web3ModalSetup} from '../utils/web3ModalFunctions'

import 'src/styles/globals.css';


const clientSideEmotionCache = createEmotionCache();
function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page:any) => page);
  const [loading, setLoading] = useState(false);
  let wallets = store.getState().wallets;

  useEffect(() => {
    setLoading(true);
    let web3Modal = web3ModalSetup();
    let connectWallet = web3ModalHelper.connectWallet;
    if (web3Modal.cachedProvider) {
        connectWallet();
    }
  }, []);

  useEffect(() => {
  if (wallets.provider?.on) {
      const handleAccountsChanged = (accounts) => {
      console.log("accountsChanged", accounts);
      if (accounts) store.dispatch(setAccount(accounts[0]));
      };

      const handleChainChanged = (_hexChainId) => {
          store.dispatch(setChainId(_hexChainId));
      };

      const handleDisconnect = () => {
      console.log("disconnect", wallets.error);
      disconnect();
      };

      wallets.provider.on("accountsChanged", handleAccountsChanged);
      wallets.provider.on("chainChanged", handleChainChanged);
      wallets.provider.on("disconnect", handleDisconnect);

      return () => {
      if (wallets.provider.removeListener) {
          wallets.provider.removeListener("accountsChanged", handleAccountsChanged);
          wallets.provider.removeListener("chainChanged", handleChainChanged);
          wallets.provider.removeListener("disconnect", handleDisconnect);
      }
      };
  }
  }, [wallets.provider]);

  return (
  <>
    {!loading ? 
    <Box sx={{display:'flex',justifyContent:'center',alignContent:'center',alignItems:"center",height:'100vh',width:'100vw'}}>
      <CircularProgress size={"100px"}/>
    </Box>
    : 
      <React.StrictMode>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>My Template</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CssBaseline />
          <NextNProgress
            color="#5dc961"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
          />
          {getLayout(<Component {...pageProps} />)}
        </Provider>
      </ThemeProvider>
  
  
      </CacheProvider>
    </React.StrictMode> 
    }
  </>
  
  )

}

export default MyApp
