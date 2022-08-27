import { useState,forwardRef, useEffect } from "react";
import {
  Button,
  Box,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Slide,
  Checkbox,
  Tooltip,
  Divider,
  Grid
} from "@mui/material";

import { styled, experimental_sx as sx } from '@mui/system';

import {truncateAddress,camelCaseToSpace} from '../../utils/helpers'
import { tooltipDelay } from "src/constants/tooltip";

import { selectWallets } from "src/redux/walletsSlice";
import { useAppSelector } from 'src/app/hooks';

import Image from "next/image";

import { myLoans } from "src/data/myLoans";




export const MyLoansPopUpLabelTypography = styled(Typography)((props)  => sx({
    fontSize:'20px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit',
}));

export const MyLoansPopUpLabel2Typography = styled(Typography)((props)  => sx({
    fontSize:'15px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit',
}));

export const MyLoansPopUpLabel3Typography = styled(Typography)((props)  => sx({
    fontSize:'20px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit',
    cursor:'pointer'
}));


export const MyLoansPopUpData1Typography = styled(Typography)((props)  => sx({
    fontSize:'30px',
    color:'white',
    fontFamily:'inherit',
    fontWeight:'700'
}));

export const MyLoansPopUpData2Typography = styled(Typography)((props)  => sx({
    fontSize:'20px',
    color:'white',
    fontFamily:'inherit',
    fontWeight:'700'
}));

export const MyLoansPopUpCollectionTitleTypography = styled(Typography)((props)  => sx({
    fontSize:'10px',
    fontWeight: 'normal',
    color:'white',
    fontFamily:'inherit',
}));

export const MyLoansPopUpCollectionDataTypography = styled(Typography)((props)  => sx({
    fontSize:'10px',
    fontWeight: 'normal',
    color:'rgba(255, 255, 255, 0.4)',
    fontFamily:'inherit',
}));


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const dataRows = [
  {
    name: 'NFT Name',
    dataName: 'name',
    unit: '',
  },
  {
    name: 'collection',
    dataName: 'collection',
    unit: '',
  },
  {
    name: 'Lended Vault',
    dataName: 'lendedVault',
    unit: '',
  },
  {
    name: 'APR',
    dataName: 'APR',
    unit: '%',
  },
  {
    name: 'Loan Amount',
    dataName: 'loanAmount',
    unit: 'WETH',
  },
  {
    name: 'Loan Date',
    dataName: 'loanDate',
    unit: '',
  },
  {
    name: 'Remaining Days',
    dataName: 'remainingDays',
    unit: 'days',
  },
  {
    name: 'Repayment Amount',
    dataName: 'repaymentAmount',
    unit: 'WETH',
  },
  {
    name: 'Action',
    dataName: '',
    unit: '',
  }
]


export const MyLoansPopUp = (props:any) => {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClose}
        PaperProps={{
          sx:{
            minWidth:'1200px',
            background: "#18181833",
            boxShadow: "3px 11px 3px rgba(0, 0, 0, 0.25)",
            backdropFilter:"blur(30px)",
            borderRadius: "20px",
            alignItems: "center",
            fontFamily:'DM Mono',
            minHeight:'800px'
          }
        }}
        >
        <DialogTitle sx={{color:'white',alignSelf: 'flex-start'}} variant="h2">{"My Loans"}</DialogTitle>
        <DialogContent sx={{width:'100%',padding:'20px'}}>
        {
          myLoans.map((loan,index)=>{
            return(
              <Box 
              sx={{display:'flex',flexDirection:'column',width:'100%',height:'270px',"background":"#1B1B21","border":"1px solid #000000","boxShadow":"0px 4px 4px rgba(0, 0, 0, 0.25)","borderRadius":"15px",padding:'20px'}}
              key={index}
              >
              <Box sx={{display:'flex',height:'100%'}}>
                <Box sx={{display:'flex',position:'relative',height:'100%',aspectRatio:'1/1',borderRadius:'15px',overflow:'hidden'}}>
                    <Image src={loan.imgSrc} layout="fill" objectFit="contain" alt=""/>
                </Box>
                <Box sx={{width:'min-content',ml:'40px',flexGrow:'1'}}>
                  <Grid container spacing={2} sx={{width:'100%',height:'100%',margin:'0px',padding:'0px'}}>
                    {
                    dataRows.map((row,index)=>{
                      return(
                        <Grid item xl={4} lg={4} md={4} sm={6} xs={12} sx={{margin:'0px',padding:'0px !important'}} key={index}>
                        <Box sx={{width:'100%',height:'100%',display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
                          {
                            row.name == "Action" ?
                              <Button variant="contained" sx={{
                                width:'50%',
                                fontSize:'20px',
                                "background":"#54AE58",
                                "boxShadow":"0px 5px 4px rgba(0, 0, 0, 0.25)",
                                "borderRadius":"5px"
                              }}>
                                Pay Back
                              </Button>
                            :
                            <Box>
                              <MyLoansPopUpLabel2Typography>
                                {row.name}
                              </MyLoansPopUpLabel2Typography>
                              <MyLoansPopUpData2Typography>
                                {`${loan[row.dataName]} ${row.unit}`}
                              </MyLoansPopUpData2Typography>                  
                            </Box>
                          }
  
  
                        </Box>
                      </Grid>
                      )
                    })
                    } 
                  </Grid>
                </Box>
              </Box>
            </Box>
            )
          })
        }

        </DialogContent>
        </Dialog>
    )
}