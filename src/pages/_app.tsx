import {useEffect,useState,StrictMode} from 'react';

import Head from 'next/head'

import { Provider } from 'react-redux';
import { store } from 'src/app/store';

import NextNProgress from "nextjs-progressbar";
import { CssBaseline, Typography } from "@mui/material";

import { theme } from "src/styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { CircularProgress,Box } from '@mui/material';
import { createEmotionCache } from "../utils/create-emotion-cache";

import Image from 'next/image';
import 'src/styles/globals.css';

const clientSideEmotionCache = createEmotionCache();
function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page:any) => page);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);
  
  return (
  <>
    {!loading ? 
    <Box sx={{height:'100vh',width:'100vw',backgroundColor:'#020710'}}>
      <Box sx={{  margin: 'auto',position: 'absolute',top: '0', left: '0', bottom: '0', right: '0',height:'fit-content',width:'fit-content'}}>
      <Typography sx={{color:'white',mx:'auto',width:'fit-content',fontSize:'5rem'}}>PepeFi</Typography>
      <Image src="/static/images/pepes/music.gif" layout="intrinsic" height="300%" width="300%"/>
      </Box>

    </Box>
    : 
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
    }
  </>
  
  )

}

export default MyApp
