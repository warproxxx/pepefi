import React, { useEffect } from 'react';
import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import { useState } from "react";
import {Button,Box,Grid,} from "@mui/material";
import { AddVaultPopup } from "src/components/Vaults/AddVaultPopup";
import { VaultCard } from "src/components/Vaults/VaultCard";
import {styled, experimental_sx as sx} from '@mui/system';
import Image from 'next/image';

import { vaults } from 'src/data/vaults';
import { selectWallets } from 'src/redux/walletsSlice';
import { useAppSelector } from 'src/app/hooks';

export const VaultsBox = styled(Box)((props)  => sx({
  minHeight: "80vh",
  width: '100%'
}));


function VaultsPage(props:any) {
  const wallets = useAppSelector(selectWallets);

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
            {
              vaults.map((vault,index)=>{
                return(
                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={index}>
                    <VaultCard vault={vault}/>
                  </Grid>
                )
              })
            }

          </Grid>

        </VaultsBox>
      </Box>
      <AddVaultPopup open={addVaultPopupOpen} handleClose={handleAddVaultPopupClose}/>
      <Box sx={{
        position: 'absolute',
        right:"5%",
        bottom: "5%",
        cursor:'pointer',
        display: `${wallets.account == '' ? 'none' : 'block'}`,
        transitionDuration:'0.5s',
        "&:hover":{
          transform:'translateY(-10px)',
        }
        }}
        onClick={()=>{handleAddVaultPopupClickOpen()}}

      >
        <Image src="/static/images/pepes/pepe2.png" height="100px" width="110px" layout="intrinsic" alt=""/>
      </Box>
    </>

  );
}

VaultsPage.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default VaultsPage;