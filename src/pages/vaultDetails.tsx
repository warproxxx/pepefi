import React from 'react';
import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import { useState } from "react";
import {Button,Box,Grid, Typography, Input, Tooltip} from "@mui/material";
import { VaultCard } from "src/components/Vaults/VaultCard";
import {styled, experimental_sx as sx} from '@mui/system';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { vaults } from 'src/data/vaults';

export const VaultDetailBox = styled(Box)((props)  => sx({
  minHeight: "80vh",
  width: '100%'
}));

export const VaultDetailLabelTypography = styled(Typography)((props)  => sx({
    fontSize:'20px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit',
    cursor:'pointer'
}));

export const VaultDetailLabel2Typography = styled(Typography)((props)  => sx({
    fontSize:'15px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit',
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

const dataRows = [
    {
        name:'Total Supply',
        dataName: 'totalWETH',
        nameDescription: 'Total supply is ...',
        unit: 'WETH'
    },
    {
        name:'APR',
        dataName:'APR',
        nameDescription: 'APR is ...',
        unit: '%'
    },
    {
        name:'Duration',
        dataName:'duration',
        nameDescription: 'Duration is ...',
        unit: 'days'
    },
    {
        name:'...',
        dataName:'empty',
        nameDescription: '...',
        data:'...',
        unit: ''
    },
    {
        name:'...',
        dataName:'empty',
        nameDescription: '...',
        data:'...',
        unit: ''
    },
    {
        name:'...',
        dataName:'empty',
        nameDescription: '...',
        data:'...',
        unit: ''
    },
]


function VaultDetailPage(props:any) {
    const [mode,setMode] = useState("deposit");
    const [selectedCollection,setSelectedCollection] = useState(-1);
    const [inputValue, setInputValue] = useState("0");

    const vault = vaults[0];
    const router = useRouter();
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
        <VaultDetailBox sx={{maxWidth:'1400px',display:'flex',justifyContent:'space-between',fontFamily:'DM Mono'}}>
            <Box sx={{width:'67%',height:'100%',background: "#121218",boxShadow: "3px 3px 11px rgba(0, 0, 0, 0.25)",borderRadius: "15px",padding:'30px'}}>
                <Box 
                sx={{display:'flex', cursor:'pointer',width:'fit-content',color:'rgba(255, 255, 255, 0.4);',transitionDuration:"0.3s",'&:hover':{
                    color:'white'
                }}}
                onClick={()=>{router.push("/vaults")}}
                >
                    <Typography variant='h2' sx={{whiteSpace:'pre-wrap'}} id="#vault_previous_page">
                        {"< "}
                    </Typography>
                    <Typography variant='h2' >
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
                                {vault.name}
                            </VaultDetailData1Typography>
                            <Box sx={{display:'flex',gap:'10px',alignItems:'center'}}> 
                                <VaultDetailLabelTypography>
                                    {vault.contractAddy}
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
                                vault.collections.map((collection,index)=>{
                                    return(
                                        <Box sx={{
                                        background: "rgba(255, 255, 255, 0.05)",
                                        boxShadow: `${index == selectedCollection ? "inset 0px 4px 4px rgba(0, 188, 7, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)" : "0px 4px 4px rgba(0, 0, 0, 0.25)"}`, 
                                        borderRadius: "50px",
                                        width:'100%',
                                        height:'50px',
                                        display:'flex',
                                        alignItems:'center',
                                        px:'5px',
                                        justifyContent:'space-between',
                                        border:`${index == selectedCollection ? "1px solid #5DC961" : "none"}`,
                                        cursor:'pointer',
                                        userSelect: 'none',
                                        '&:hover':{
                                            boxShadow: `${index == selectedCollection ? "inset 0px 4px 4px rgba(0, 188, 7, 0.25), 0px 8px 8px rgba(0, 0, 0, 0.5)" : "0px 8px 8px rgba(0, 0, 0, 0.5)"}`, 
                                        }
                                        }} 
                                        key={index}
                                        onClick={()=>{index == selectedCollection ? setSelectedCollection(-1) : setSelectedCollection(index)}}
                                        >
                                            <Box sx={{borderRadius: "50%",height:'45px',width:'45px',overflow:'hidden'}}>
                                                <Image src={collection.imgSrc} layout="responsive" height="100%" width="100%"></Image>
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

                <Box sx={{mt:"40px",display:'flex',flexDirection:'column'}}>
                    <VaultDetailData1Typography>
                        {selectedCollection == -1 ? "Vault Data" : `${vault.collections[selectedCollection].name} Collection Data`}
                    </VaultDetailData1Typography>
                    <Box sx={{mt:'20px',display:'flex'}}>
                    <Grid container spacing={2}>
                        {
                            dataRows.map((row,index)=>{
                                return(
                                    <Grid item xl={4} lgp={4} lg={4} md={4} smpad={4} sm={4} xs={6} key={index}>
                                        <Box sx={{
                                            background: "#1B1B21",
                                            border: "1px solid #000000",
                                            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                            borderRadius: "15px",
                                            height:'150px',
                                            width:'100%',
                                            display:'flex',
                                            flexDirection:'column',
                                            justifyContent:'center',
                                            alignItems:'center',
                                            gap: '15%'
                                        }}>
                                            <Tooltip title={row.nameDescription} placement="top">
                                                <VaultDetailLabelTypography>
                                                {row.name}
                                                </VaultDetailLabelTypography>
                                            </Tooltip>

                                            
                                            <VaultDetailData2Typography>
                                                {typeof(vault.data[row.dataName]) == 'object' ?
                                                 `${vault.data[row.dataName]?.min}/${vault.data[row.dataName]?.average}/${vault.data[row.dataName]?.max} ${row.unit}` :
                                                `${vault.data[row.dataName]} ${row.unit}`}
                                            </VaultDetailData2Typography>

                                        </Box>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                    </Box>
                </Box>

                <Box sx={{mt:"40px",display:'flex',flexDirection:'column'}}>
                    <VaultDetailData1Typography>
                    {selectedCollection == -1 ? "All Loanded NFTs" : `${vault.collections[selectedCollection].name} Loanded NFTs`}
                    </VaultDetailData1Typography>
                    <Box 
                    id="vaultDetailNFTBox"
                    sx={{
                        display:'-webkit-inline-box',
                        mt:'0px',
                        gap:'20px',
                        overflowX:'auto',
                        overflowY:'hidden',
                        py:'20px',
                    }}>
                        {[0,1,2,3].map((collection,index)=>{
                            return(
                                <Box 
                                    key={index}
                                    sx={{
                                    background: "#1B1B21",
                                    border: "1px solid #000000",
                                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                    borderRadius: "15px",
                                    aspectRatio:'1/1.4',
                                    width:'31.5%',
                                    padding:'15px',
                                    display:'flex',
                                    flexDirection:'column',
                                }}>
                                    <Box sx={{
                                        borderRadius: "15px",
                                        overflow:'hidden',
                                        width:'100%',
                                        aspectRatio:'1/0.8',
                                    }}>
                                        <Image src="/static/images/vaults/collection1.png" layout="responsive" height="100%" width="100%"></Image>
                                    </Box>
                                    <Box sx={{
                                        display:'flex',
                                        mt:'20px',
                                        flexDirection:'column'
                                    }}>
                                        <Box sx={{
                                            display:'flex',
                                            justifyContent:'space-between'
                                        }}>
                                            <Box sx={{width:'50%'}}>
                                                <VaultDetailLabel2Typography>
                                                    {'NFT Value'}
                                                </VaultDetailLabel2Typography>
                
                                                <VaultDetailData2Typography>
                                                    {'55 WETH'}
                                                </VaultDetailData2Typography>
                                            </Box>
        
                                            <Box sx={{width:'50%'}}>
                                                <VaultDetailLabel2Typography>
                                                    {'Duration'}
                                                </VaultDetailLabel2Typography>
                
                                                <VaultDetailData2Typography>
                                                    {'30 days'}
                                                </VaultDetailData2Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            display:'flex',
                                            justifyContent:'space-between'
                                        }}>
                                            <Box sx={{width:'50%'}}>
                                                <VaultDetailLabel2Typography>
                                                    {'Loan Amount'}
                                                </VaultDetailLabel2Typography>
                
                                                <VaultDetailData2Typography>
                                                    {'20 WETH'}
                                                </VaultDetailData2Typography>
                                            </Box>
        
                                            <Box sx={{width:'50%'}}>
                                                <VaultDetailLabel2Typography>
                                                    {'APR'}
                                                </VaultDetailLabel2Typography>
                
                                                <VaultDetailData2Typography>
                                                    {'10 %'}
                                                </VaultDetailData2Typography>
                                            </Box>
                                        </Box> 
                                    </Box>
        
        
                                </Box>
                            )
                        })}

                    </Box>
                </Box>                


            </Box>
            <Box sx={{width:'32%',height:'fit-content',background: "#121218",boxShadow: "3px 3px 11px rgba(0, 0, 0, 0.25)",borderRadius: "15px",paddingBottom:'20px'}}>
                <Box sx={{display:'flex'}}>
                    <Box sx={{width:'50%',display:'flex',justifyContent:'center',backgroundColor:`${mode=="deposit" ? "#121218" : '#1B1B21'}`,borderRadius:'5px',padding:'20px',cursor:'pointer','&:hover':{
                        boxShadow: "inset 0 0 20px 0px #121218"
                    }}}
                    onClick={()=>{setMode('deposit')}}
                    >
                        <Typography variant='h4' sx={{color:'white',fontFamily:'inherit'}}>
                            DEPOSIT
                        </Typography>
                    </Box>

                    <Box sx={{width:'50%',display:'flex',justifyContent:'center',backgroundColor:`${mode=="withdrawl" ? "#121218" : '#1B1B21'}`,borderRadius:'5px',padding:'20px',cursor:'pointer','&:hover':{
                        boxShadow: "inset 0 0 20px 0px #121218"
                    }}}
                    onClick={()=>{setMode('withdrawl')}}
                    >
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
                            {/* <Typography variant="h3"sx={{color: 'rgba(255, 255, 255, 0.4)'}}>
                                0
                            </Typography>   */}
                            <Input disableUnderline value={inputValue} sx={{color: 'white',fontSize:'36px'}} onChange={(e)=>{setInputValue(e.target.value)}}></Input>                      
                        </Box>   

 

                        <Button sx={{mt:'70px',borderRadius: "15px",color:'white',padding:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:"30px",width:'100%'}} variant="contained">
                            Confirm
                        </Button>          


                    </Box>
                </Box>

            </Box>

        </VaultDetailBox>
      </Box>
    </>
  );
}

VaultDetailPage.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default VaultDetailPage;