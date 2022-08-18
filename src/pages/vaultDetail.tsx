import React from 'react';
import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import { useState } from "react";
import {Button,Box,Grid, Typography,} from "@mui/material";
import { VaultCard } from "src/components/Vaults/VaultCard";
import {styled, experimental_sx as sx} from '@mui/system';
import Image from 'next/image';

export const VaultsBox = styled(Box)((props)  => sx({
  minHeight: "80vh",
  width: '100%'
}));

export const VaultDetailLabelTypography = styled(Typography)((props)  => sx({
    fontSize:'20px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit'
}));

export const VaultDetailData1Typography = styled(Typography)((props)  => sx({
    fontSize:'30px',
    fontWeight: 'normal',
    color:'white',
    fontFamily:'inherit',
    fontWeight:'700'
}));

export const VaultDetailData2Typography = styled(Typography)((props)  => sx({
    fontSize:'20px',
    fontWeight: 'normal',
    color:'white',
    fontFamily:'inherit',
    fontWeight:'700'
}));

export const VaultDetailCollectionTitleTypography = styled(Typography)((props)  => sx({
    fontSize:'10px',
    fontWeight: 'normal',
    color:'white',
    fontFamily:'inherit',
}));

export const VaultDetailCollectionDataTypography = styled(Typography)((props)  => sx({
    fontSize:'10px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit',
}));




const collections = [
    {
        name:'Bored Ape Yacht Club',
        price:"25.67ETH/+10.16%",
        img: '/static/images/vaults/collection1.png'
    },
    {
        name:'Otherdeed for Otherside',
        price:"1.7ETH/+5.16%",
        img: '/static/images/vaults/collection2.png'
    },
    {
        name:'Doodle',
        price:"7.5ETH/+3.16%",
        img: '/static/images/vaults/collection3.png'
    },
    {
        name:'Moonbirds',
        price:"12.4ETH/-5.16%",
        img: '/static/images/vaults/collection4.png'
    },

]


function VaultDetail(props:any) {
  return (
    <>
      <Head>
        <title>
          PepeFi | Vault Detail 
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
        <VaultsBox sx={{maxWidth:'1400px',display:'flex',justifyContent:'space-between',fontFamily:'DM Mono'}}>
            <Box sx={{width:'67%',height:'100%',background: "#121218",boxShadow: "3px 3px 11px rgba(0, 0, 0, 0.25)",borderRadius: "15px",padding:'30px'}}>
                <Box sx={{display:'flex'}}>
                    <Typography variant='h2' sx={{color: "rgba(255, 255, 255, 0.4)",whiteSpace:'pre-wrap'}}>
                        {"< "}
                    </Typography>
                    <Typography variant='h2' sx={{color:'white'}}>
                        {"Vaults"}
                    </Typography>
                </Box>

                <Box sx={{display:'flex',mt:'20px'}}>
                    <Box sx={{width:'50%'}}>
                        <Box>
                            <VaultDetailLabelTypography>
                                Vault Name
                            </VaultDetailLabelTypography>
                            <VaultDetailData1Typography>
                                Goblin Sax Vault
                            </VaultDetailData1Typography>
                            <Box sx={{display:'flex',gap:'10px',alignItems:'center'}}> 
                                <VaultDetailLabelTypography>
                                    0XCC32...9624
                                </VaultDetailLabelTypography>
                                <Box sx={{cursor:'pointer'}}>
                                    <Image src="/static/images/icons/copy-paste.svg" height="20px" width='20px'/>
                                </Box>
                                <Box sx={{cursor:'pointer'}}>
                                    <Image src="/static/images/icons/external-link.svg" height="20px" width='20px'/>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{display:'flex',mt:'20px'}}>
                            <Box>
                                <VaultDetailLabelTypography>
                                    My Supply
                                </VaultDetailLabelTypography>
                                <VaultDetailData2Typography>
                                    30 WETH
                                </VaultDetailData2Typography>     
                                <VaultDetailData2Typography>
                                    $32,596.20
                                </VaultDetailData2Typography>                
                            </Box>

                            <Box>

                            </Box>

                        </Box>
                    </Box>
                    <Box sx={{width:'50%'}}>
                            <VaultDetailLabelTypography>
                                Collections
                            </VaultDetailLabelTypography>  
                            <Box sx={{display:'grid',gridTemplateColumns: "repeat(2, 1fr)",gap:'20px',mt:'20px'}}>
                            {
                                collections.map((collection,index)=>{
                                    return(
                                        <Box sx={{background: "rgba(255, 255, 255, 0.05)",boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", borderRadius: "50px",width:'100%',height:'50px',display:'flex',alignItems:'center',px:'5px',justifyContent:'space-between'}} key={index}>
                                            <Box sx={{borderRadius: "50%",height:'45px',width:'45px',overflow:'hidden'}}>
                                                <Image src={collection.img} layout="responsive" height="100%" width="100%"></Image>
                                            </Box>
                                            <Box sx={{display: "flex", width: "75%", justifyContent: "center",flexDirection:'column',alignItems:'center',gap:'5px'}}>
                                                <VaultDetailCollectionTitleTypography>
                                                    {collection.name}
                                                </VaultDetailCollectionTitleTypography>
                                                <VaultDetailCollectionDataTypography>
                                                    {collection.price}
                                                </VaultDetailCollectionDataTypography>                                   
                                                
                                            </Box>
                                        </Box>
                                    )
                                })
                            }

                            </Box>       
                    </Box>
                </Box>


            </Box>
            <Box sx={{width:'32%',height:'fit-content',background: "#121218",boxShadow: "3px 3px 11px rgba(0, 0, 0, 0.25)",borderRadius: "15px",paddingBottom:'20px'}}>
                <Box sx={{display:'flex'}}>
                    <Box sx={{width:'50%',display:'flex',justifyContent:'center',backgroundColor:'#1B1B21',borderRadius:'5px',padding:'20px'}}>
                        <Typography variant='h4' sx={{color:'white',fontFamily:'inherit'}}>
                            DEPOSIT
                        </Typography>
                    </Box>

                    <Box sx={{width:'50%',display:'flex',justifyContent:'center',borderRadius:'5px',padding:'20px'}}>
                        <Typography variant='h4' sx={{color:'white',fontFamily:'inherit'}}>
                            WITHDRAWL
                        </Typography>
                    </Box>
                </Box>

                <Box>
                    <Box sx={{padding:'20px'}}>

                        <Box sx={{mt:'20px'}}>
                            <Typography variant="h6"sx={{color: 'rgba(255, 255, 255, 0.4)'}}>
                                AMOUNT(WETH)
                            </Typography>
                        </Box>

                        <Box sx={{mt:'20px',background: "#1B1B21", border: "1px solid #000000", borderRadius: "15px",padding:'20px'}}>
                            <Typography variant="h3"sx={{color: 'rgba(255, 255, 255, 0.4)'}}>
                                0
                            </Typography>                   
                        </Box>         

                        <Box sx={{mt:'70px',background: "#5DC961",boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",borderRadius: "15px",color:'white',padding:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:"30px"}}>
                            Confirm
                        </Box>          


                    </Box>
                </Box>

            </Box>

        </VaultsBox>
      </Box>
    </>
  );
}

VaultDetail.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default VaultDetail;