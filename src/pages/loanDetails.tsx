import React from 'react';
import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import { useState } from "react";
import {Button,Box,Grid, Typography,} from "@mui/material";
import { VaultCard } from "src/components/Vaults/VaultCard";
import {styled, experimental_sx as sx} from '@mui/system';
import Image from 'next/image';

export const LoanDetailBox = styled(Box)((props)  => sx({
  minHeight: "80vh",
  width: '100%'
}));

export const LoanDetailNFTNameTypography = styled(Typography)((props)  => sx({
  fontSize:'17px',
  fontWeight: 'normal',
  fontFamily:'inherit',
  color: "#5DC961"
}));

export const LoanDetailLabelTypography = styled(Typography)((props)  => sx({
    fontSize:'20px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit'
}));

export const LoanDetailLabel2Typography = styled(Typography)((props)  => sx({
    fontSize:'15px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit',
}));

export const LoanDetailData1Typography = styled(Typography)((props)  => sx({
    fontSize:'30px',
    fontWeight: 'normal',
    color:'white',
    fontFamily:'inherit',
    fontWeight:'700'
}));

export const LoanDetailData2Typography = styled(Typography)((props)  => sx({
    fontSize:'20px',
    fontWeight: 'normal',
    color:'white',
    fontFamily:'inherit',
    fontWeight:'700'
}));

export const LoanDetailCollectionTitleTypography = styled(Typography)((props)  => sx({
    fontSize:'10px',
    fontWeight: 'normal',
    color:'white',
    fontFamily:'inherit',
}));

export const LoanDetailCollectionDataTypography = styled(Typography)((props)  => sx({
    fontSize:'10px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit',
}));

const collections = [
    {
        name:'Bored Ape Yacht Club',
        price:"25.67 WETH/+10.16%",
        img: '/static/images/vaults/collection1.png'
    },
    {
        name:'Otherdeed for Otherside',
        price:"1.7 WETH/+5.16%",
        img: '/static/images/vaults/collection2.png'
    },
    {
        name:'Doodle',
        price:"7.5 WETH/+3.16%",
        img: '/static/images/vaults/collection3.png'
    },
    {
        name:'Moonbirds',
        price:"12.4 WETH/-5.16%",
        img: '/static/images/vaults/collection4.png'
    },
]

function LoanDetailPage(props:any) {
  return (
    <>
      <Head>
        <title>
          PepeFi | Loan Detail 
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
        <LoanDetailBox sx={{maxWidth:'1400px',display:'flex',justifyContent:'space-between',fontFamily:'DM Mono'}}>
          <Box sx={{
            background:"#121218",
            boxShadow: "3px 3px 11px rgba(0, 0, 0, 0.25)",
            borderRadius: "15px",
            width:'100%',
            padding: '30px'
          }}>
            <Box sx={{display:'flex'}}>
              <Typography variant='h2' sx={{color: "rgba(255, 255, 255, 0.4)",whiteSpace:'pre-wrap'}}>
                  {"< "}
              </Typography>
              <Typography variant='h2' sx={{color:'white'}}>
                  {"Loans"}
              </Typography>
            </Box>
            <Box sx={{
              display:'flex',
              mt:'20px'
            }}>
              <Box sx={{
                width:'50%'
              }}>
                <Box sx={{
                  border: "1px solid #FEDA84",
                  boxShadow: "3px 5px 13px -8px #FFC3AB",
                  borderRadius: "18px",
                  height:'100%',
                  overflow: 'clip'
                }}>
                  <Image src="/static/images/loans/NFT1.png" layout="responsive" height="100%" width="100%"/>
                </Box>

              </Box>

              <Box sx={{
                width:'50%',
                paddingLeft:'50px',
                display:'flex',
                flexDirection:'column'               
              }}>
                <Box sx={{
                  display:'flex',
                  flexDirection:'column'
                }}>
                  <LoanDetailLabelTypography>
                    NFT Information
                  </LoanDetailLabelTypography>
                  <LoanDetailData1Typography>
                    Doodle #2799
                  </LoanDetailData1Typography>
                  <LoanDetailNFTNameTypography>
                    Doodle
                  </LoanDetailNFTNameTypography>
                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  mt:'20px'
                }}>
                  <LoanDetailLabelTypography>
                    NFT Valuation
                  </LoanDetailLabelTypography>
                  <LoanDetailData1Typography>
                    9.602 WETH
                  </LoanDetailData1Typography>
                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  mt:'20px'
                }}>
                  <LoanDetailLabelTypography>
                    Select Vault
                  </LoanDetailLabelTypography>

                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  mt:'20px'
                }}>
                  <LoanDetailLabelTypography>
                    Duration
                  </LoanDetailLabelTypography>

                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  mt:'20px'
                }}>
                  <LoanDetailLabelTypography>
                    Amount
                  </LoanDetailLabelTypography>

                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'row',
                  mt:'20px',
                  gap:'80px'
                }}>
                  <Box>
                    <LoanDetailLabelTypography>
                      APR
                    </LoanDetailLabelTypography>
                    <LoanDetailData1Typography>
                      10 %
                    </LoanDetailData1Typography>
                  </Box>

                  <Box>
                    <LoanDetailLabelTypography>
                      Payment
                    </LoanDetailLabelTypography>
                    <LoanDetailData1Typography>
                      1.02 WEth
                    </LoanDetailData1Typography>
                  </Box>

                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  marginTop:'auto'
                }}>
                  <Button variant="contained" onClick={()=>{console.log('getting loan')}} sx={{width:'140px'}}>
                      Get Loan
                  </Button>

                </Box>

              </Box>
            </Box>
          </Box>
        </LoanDetailBox>
      </Box>
    </>
  );
}

LoanDetailPage.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default LoanDetailPage;