import React from 'react';
import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import { useState } from "react";
import {Button,Box,Grid,Typography} from "@mui/material";
import {styled, experimental_sx as sx} from '@mui/system';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { lendingNFT as not_redux_lendingNFT } from 'src/data/lendingNFT';
// import { loans as not_redux_loans } from 'src/data/loans';

import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { selectLoans,setLoans } from 'src/redux/loansSlice';
import { setLendingNFT } from 'src/redux/lendingNFTSlice';


export const LoansBox = styled(Box)((props)  => sx({
  minHeight: "80vh",
  width: '100%'
}));

export const LoansNFTNameTypography = styled(Typography)((props)  => sx({
    fontSize:'17px',
    fontWeight: 'normal',
    fontFamily:'inherit',
    color: "#5DC961"
}));

export const LoansNFTNumberTypography = styled(Typography)((props)  => sx({
    fontSize:'20px',
    color:'white',
    fontFamily:'inherit',
    fontWeight: "700"
}));

function LoansPage(props:any) {
  const loans = useAppSelector(selectLoans);
  const dispatch = useAppDispatch();
  
  // dispatch(setLoans(not_redux_loans))

  const router = useRouter();
  return (
    <>
      <Head>
        <title>
          PepeFi | Loans
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
        <LoansBox sx={{maxWidth:'1400px'}}>
        {
          loans.allNFTs.length < 1 ? 
          <Typography>Please log in to see your NFTs for loan.</Typography>
          :
          <Grid container spacing={8}>
          {
            loans.allNFTs.map((NFT,index)=>{
              return(
                <Grid item xl={3} lg={3} md={3} sm={6} xs={12} key={index}>
                  <Box sx={{
                    background: "linear-gradient(180deg, #071631 0%, #242435 100%)",
                    boxShadow: "3px 2px 4px rgba(115, 137, 217, 0.25)",
                    borderRadius: "10px",
                    width:'100%',
                    padding:'15px',
                    cursor:'pointer',
                    "&:hover":{
                        boxShadow: "3px 2px 10px 1px rgba(115, 137, 217, 0.5)",
                    }
                  }}
                  onClick={()=>{
                    dispatch(setLendingNFT(not_redux_lendingNFT));
                    router.push("/loanDetails");
                  }}
                  >
                    <Box sx={{
                        borderRadius: "15px",
                        overflow:'hidden',
                        width:'95%',
                        mx:'auto'
                    }}>
                        <Image src={NFT.imgSrc} layout="responsive" height="100%" width="100%"/>
                    </Box>
                    <Box sx={{
                        display:'flex',
                        alignItems:'center',
                        flexDirection:'column',
                        mt:'20px',
                        gap:'10px'
                    }}>
                        <LoansNFTNameTypography>
                          {NFT.collection}
                        </LoansNFTNameTypography>
                        <LoansNFTNumberTypography>
                          {NFT.name}
                        </LoansNFTNumberTypography>
                    </Box>
                  </Box>
              </Grid>
              )
            })
          }
        </Grid>
        }


        </LoansBox>
      </Box>
    </>
  );
}

LoansPage.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default LoansPage;