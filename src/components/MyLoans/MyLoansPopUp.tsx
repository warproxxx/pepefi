//@ts-nocheck
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
  Grid,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import { styled, experimental_sx as sx } from '@mui/system';

import {truncateAddress,camelCaseToSpace} from '../../utils/helpers'
import { tooltipDelay } from "src/constants/tooltip";

import { selectWallets } from "src/redux/walletsSlice";
import { useAppSelector } from 'src/app/hooks';

import Image from "next/image";

import { myLoans } from "src/data/myLoans";

import MUIDataTable from "mui-datatables";



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

const dataRows2 = [
  {
    name: 'imgSrc',
    dataName: 'imgSrc',
    unit: '',
    label: 'NFT Picture',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value:string, tableMeta:any, updateValue:string) => {
        return (
          <img src={value} height="50px" style={{borderRadius:'10px'}}></img>
        );
      }
    }
  },
  {
    name: 'name',
    dataName: 'name',
    unit: '',
    label: 'NFT Name',
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: 'collection',
    dataName: 'collection',
    unit: '',
    label: 'collection',
    options: {
      filter: true,
      sort: true,
     }
  },
  {
    name: 'lendedVault',
    dataName: 'lendedVault',
    unit: '',
    label: 'Lended Vault',
    options: {
      filter: true,
      sort: true,
     }
  },

  {
    name: 'APR',
    dataName: 'APR',
    unit: '%',
    label: 'APR',
    options: {
      filter: true,
      sort: true,
     }
  },
  {
    name: 'loanAmount',
    dataName: 'loanAmount',
    unit: 'WETH',
    label: 'Loan Amount',
    options: {
      filter: true,
      sort: true,
     }
  },
  {
    name: 'loanDate',
    dataName: 'loanDate',
    unit: '',
    label: 'Loan Date',
    options: {
      filter: true,
      sort: true,
     }
  },
  {
    name: 'remainingDays',
    dataName: 'remainingDays',
    unit: 'days',
    label: 'Remaining Days',
    options: {
      filter: true,
      sort: true,
     }
  },
  {
    name: 'repaymentAmount',
    dataName: 'repaymentAmount',
    unit: 'WETH',
    label: 'Repayment Amount',
    options: {
      filter: true,
      sort: true,
     }
  },
  {
    name: 'action',
    dataName: '',
    unit: '',
    label: 'Action',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value:string, tableMeta:any, updateValue:string) => {
        return (
          <Button 
            onClick={()=>console.log(value)}
            variant="contained"
            sx={{
                backgroundColor:'#5dc961 !important',
                paddingX:'8px',
                paddingY:'5px',
                whiteSpace: 'nowrap'
            }}>
              Pay Loan
          </Button>
          );
      }
     }
  }
]

const options = {
  selectableRowsHideCheckboxes:true,
  filterType: 'checkbox',
  pagination: false,
  selectableRows: 'none',
  viewColumns: false,
}

const getMuiTheme = () => createTheme({
  components: {
      MuiPaper:{
        styleOverrides:{
          root: { backgroundColor:'transparent',color:'white !important',fontFamily:'DM Mono !important',
          "boxShadow":"none",
          padding:'20px'
          }
        }
      },
      MuiTableRow:{
        styleOverrides:{
          root: { backgroundColor:'transparent',color:'white' }
        }
      },
      MuiTableCell:{
        styleOverrides:{
          root: { backgroundColor:'transparent !important',color:'white !important',borderBottom:'1px solid rgb(255 255 255 / 40%);'},
          head: {
            '& div[class*="sort"]':{
              color:'white !important',
            },
            '& svg':{
              color:'white !important',
            }
          },
          body:{
            fontFamily:'inherit !important'
          }
        },
      },
      MuiButtonBase:{
        styleOverrides:{
          root: { backgroundColor:'transparent !important',color:'white !important' }
        }
      },
      MuiToolbar:{
        styleOverrides:{
          root: {display: "none"}
        }
      }
      
  },

})

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
            minWidth:'1400px',
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

          <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={myLoans}
              columns={dataRows2}
              options={options}
            />
          </ThemeProvider>

        </DialogContent>
        </Dialog>
    )
}