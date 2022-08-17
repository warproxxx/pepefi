import React from 'react';
import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import { useState } from "react";
import {Button,Box,Grid,} from "@mui/material";
import { AddVaultPopup } from "src/components/Vaults/AddVaultPopup";
import { VaultCard } from "src/components/Vaults/VaultCard";
import { VaultDetailsPopup } from "src/components/Vaults/VaultDetailsPopup";
import {styled, experimental_sx as sx} from '@mui/system';

export const VaultsBox = styled(Box)((props)  => sx({
  minHeight: "80vh",
  width: '100%'
}));

function IndexPage(props) {
  return (
    <>
      <Head>
        <title>
          PepeFi
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
        <VaultsBox sx={{maxWidth:'1400px'}}>
          <Grid container spacing={2}>
            <Grid item xl={3} lgp={3} lg={3} md={4} smpad={4} sm={6} xs={12} >
              <VaultCard vaultName={"Goblin Sax Vault"} mainColor={"white"} volume={7000} apr={5} status={'active'} data={[5000,6000,6500,7000]} /*handleVaultDetailPopupClickOpen={handleVaultDetailPopupClickOpen}*//>
            </Grid>


          </Grid>

        </VaultsBox>
      </Box>
    </>
  );
}

IndexPage.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default IndexPage;