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

const dataRows = [
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
     }
  }
]

const dataRows2 = [
  {
    name: 'nftPicture',
    dataName: 'nftPicture',
    unit: '',
    label: 'NFT Picture',
    options: {
      filter: false,
      sort: false,
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
          "boxShadow":"0px 2px 5px 1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 20%), 0px 1px 5px 0px rgb(0 0 0 / 20%)",
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
        {/* {
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
                            row.label == "Action" ?
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
                                {row.label}
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
        <Box sx={{my:'40px'}}/> */}
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