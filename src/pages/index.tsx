import React, { useEffect } from 'react';
import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import { useState } from "react";
import {Button,Box,Grid,} from "@mui/material";
import { AddVaultPopup } from "src/components/Vaults/AddVaultPopup";
import { VaultCard } from "src/components/Vaults/VaultCard";
import { VaultDetailsPopup } from "src/components/Vaults/VaultDetailsPopup";
import {styled, experimental_sx as sx} from '@mui/system';
import Image from 'next/image';

import { ethers } from "ethers";
import Web3Modal from "web3modal";


export const VaultsBox = styled(Box)((props)  => sx({
  minHeight: "80vh",
  width: '100%'
}));


function IndexPage(props:any) {
  const [addVaultPopupOpen, setAddVaultPopupOpen] = useState(false);

  const handleAddVaultPopupClickOpen = () => {
    setAddVaultPopupOpen(true);
  };

  const handleAddVaultPopupClose = () => {
    setAddVaultPopupOpen(false);
  };

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
          justifyContent: 'center'
        }}
      >
        <VaultsBox sx={{maxWidth:'1400px',position:'relative'}}>
          <Grid container spacing={8}>
            <Grid item xl={4} lgp={4} lg={4} md={4} smpad={4} sm={6} xs={12} >
              <VaultCard vaultName={"Goblin Sax Vault"} mainColor={"white"} volume={7000} apr={5} status={'active'} data={[5000,6000,6500,7000]} /*handleVaultDetailPopupClickOpen={handleVaultDetailPopupClickOpen}*//>
            </Grid>
            <Grid item xl={4} lgp={4} lg={4} md={4} smpad={4} sm={6} xs={12} >
              <VaultCard vaultName={"Goblin Sax Vault"} mainColor={"white"} volume={7000} apr={5} status={'active'} data={[5000,6000,6500,7000]} /*handleVaultDetailPopupClickOpen={handleVaultDetailPopupClickOpen}*//>
            </Grid>

          </Grid>
        <Box sx={{
        position: 'absolute',
        right:"0%",
        bottom: "0%",
        cursor:'pointer',
        transitionDuration:'0.5s',
        "&:hover":{
          transform:'translateY(-10px)',
        }
        }}
        onClick={()=>{handleAddVaultPopupClickOpen()}}

      >
        <Image src="/static/images/pepes/pepe.png" height="113px" width="131px" layout="intrinsic"/>
      </Box>
        </VaultsBox>
      </Box>
      <AddVaultPopup open={addVaultPopupOpen} handleClose={handleAddVaultPopupClose}/>

    </>

  );
}

IndexPage.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default IndexPage;