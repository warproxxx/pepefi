import React from 'react';
import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import {Button,Box,Grid,} from "@mui/material";
import {useEffect,useState} from 'react'

import {web3ModalHelper} from '../utils/web3ModalFunctions'
import {truncateAddress,toHex} from '../utils/helpers'

import { useAppSelector } from '../app/hooks';
import {
    selectWallets,
} from '../redux/walletsSlice';

function IndexPage(props:any) {
    let connectWallet = web3ModalHelper.connectWallet;
    let disconnect = web3ModalHelper.disconnect;
    const wallets = useAppSelector(selectWallets);

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
      <Button onClick={()=>{disconnect();}} variant="contained">REAL disconnect button</Button>
      <p style={{color:'white'}}>{`Connection Status: ${wallets.account ? 'good' : 'bad'}`}</p>
      <p style={{color:'white'}}>{`Account: ${truncateAddress(wallets.account)}`}</p>
      <p style={{color:'white'}}>{`Network ID: ${wallets.chainId ? wallets.chainId : "No Network"}`}</p>
      
      </Box>
    </>

  );
}

IndexPage.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default IndexPage;