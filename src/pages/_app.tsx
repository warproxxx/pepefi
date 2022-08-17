import React from 'react';

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

import 'src/styles/globals.css';


const clientSideEmotionCache = createEmotionCache();
function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page:any) => page);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
  }, []);
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
            color="#29D"
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
