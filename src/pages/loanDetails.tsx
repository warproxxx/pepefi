//@ts-nocheck

import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import { useEffect, useState } from "react";
import {Button,Box,Grid, Typography, Slider, Divider, Menu, MenuItem, Input, InputAdornment} from "@mui/material";
import { VaultCard } from "src/components/Vaults/VaultCard";
import {styled, experimental_sx as sx} from '@mui/system';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { lendingNFT as not_redux_lendingNFT } from 'src/data/lendingNFT';

import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { selectLendingNFT,setLendingNFT } from 'src/redux/lendingNFTSlice';
import {takeLoan, getRepayment} from 'src/utils/contractFunctions';




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
    color:'white',
    fontFamily:'inherit',
    fontWeight:'700'
}));

export const LoanDetailData2Typography = styled(Typography)((props)  => sx({
    fontSize:'20px',
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

export const LoanDetailBestVaultMenuItem = styled(MenuItem)((props)  => sx({
  '&:hover':{
    backgroundColor: "rgba(55, 65, 81, 0.15)"
  }
}));

export const LoanDetailBestVaultMenuItemDivier = styled(Divider)((props)  => sx({
  borderColor:'#26262D'
}));

function LoanDetailPage(props:any) {
  const router = useRouter();

  const lendingNFT = useAppSelector(selectLendingNFT);
  const dispatch = useAppDispatch();

  const [loanAmount, setLoanAmount] = useState<number | number[]>(0.01);
  const [durationSliderValue, setDurationSliderValue] = useState<number | number[]>(0);

  const handleChangeDurationSlider = (event: Event, value: number | number [], activeThumb: number) => {
    setDurationSliderValue(value);
  };
  
  const changeRepaymentBaseOnDuration = () => {
    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    let vaults = lendingNFT.vaults;
    let APR = vaults[selectedVaultIndex].APR/1000;
    let duration = durationSliderValue;
    console.log(APR,duration,loanAmount)
    let repayment = Number(getRepayment(loanAmount,duration,APR)).toFixed(3);
    let repaymentDate = addDays(new Date(), duration).toLocaleDateString();
    dispatch(setLendingNFT({
      repayment: repayment,
      duration: durationSliderValue,
      repaymentDate: repaymentDate
    }))
  };

  const handleChange = (event: Event, value: number | number [], activeThumb: number) => {
    setLoanAmount(value);
  };

  const changeRepaymentBaseOnLoanAmount = () => {
    let vaults = lendingNFT.vaults;
    let APR = vaults[selectedVaultIndex].APR/1000;
    let duration = durationSliderValue;
    console.log(APR,duration,loanAmount)
    let repayment = Number(getRepayment(loanAmount,duration,APR)).toFixed(3);
    dispatch(setLendingNFT({
      repayment: repayment,
      loanAmount: loanAmount
    }))
  };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedVaultIndex,setSelectedVaultIndex] = useState(0);

  const handleSelectVaultIndexChange = (index:number) =>{
    if(selectedVaultIndex == index)
      return
    let vaults = lendingNFT.vaults;
    let APR = vaults[index].APR/1000;
    let duration = durationSliderValue;
    let repayment = Number(getRepayment(loanAmount,duration,APR)).toFixed(2);
    dispatch(setLendingNFT({
      repayment: repayment,
      APR: APR,
      durationMax: vaults[index].durationInDays
    }))
    setDurationSliderValue(Math.ceil(vaults[index].durationInDays/2));
    setSelectedVaultIndex(index);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      changeRepaymentBaseOnLoanAmount()
      changeRepaymentBaseOnDuration()
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  },[durationSliderValue,loanAmount])

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
        {
          lendingNFT.name == '' ? 
          <Typography>Return to loans page to select an NFT for lending</Typography>:
          <LoanDetailBox sx={{maxWidth:'1400px',display:'flex',justifyContent:'space-between',fontFamily:'DM Mono'}}>
          <Box sx={{
            background:"#121218",
            boxShadow: "3px 3px 11px rgba(0, 0, 0, 0.25)",
            borderRadius: "15px",
            width:'100%',
            padding: '30px'
          }}>
            <Box 
            sx={{display:'flex', cursor:'pointer',width:'fit-content',color:'rgba(255, 255, 255, 0.4);',transitionDuration:"0.3s",'&:hover':{
                color:'white'
            }}}
            onClick={()=>{router.push("/loans")}}
            >
                <Typography variant='h2' sx={{whiteSpace:'pre-wrap'}} id="#vault_previous_page">
                    {"< "}
                </Typography>
                <Typography variant='h2' >
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
                  // border: "1px solid #FEDA84",
                  // boxShadow: "3px 5px 13px -8px #FFC3AB",
                  borderRadius: "18px",
                  overflow: 'clip',
                  height:'fit-content'
                }}>
                  <Image src={lendingNFT.imgSrc} layout="responsive" height="100%" width="100%"/>
                </Box>

              </Box>

              <Box sx={{
                width:'50%',
                paddingLeft:'50px',
                display:'flex',
                flexDirection:'column'               
              }}>
                <Box sx={{display:'flex',gap:'50px'}}>
                  <Box sx={{
                    display:'flex',
                    flexDirection:'column',
                    width:'40%',
                  }}>
                    <LoanDetailLabelTypography>
                      NFT Information
                    </LoanDetailLabelTypography>
                    <LoanDetailData1Typography>
                      {lendingNFT.name}
                    </LoanDetailData1Typography>
                    <LoanDetailNFTNameTypography>
                      {lendingNFT.collection}
                    </LoanDetailNFTNameTypography>
                  </Box>
                  <Box sx={{
                    display:'flex',
                    flexDirection:'column',
                    width:'40%'
                  }}>
                    <LoanDetailLabelTypography>
                      NFT Valuation
                    </LoanDetailLabelTypography>
                    <LoanDetailData1Typography>
                      {lendingNFT.valuation.toFixed(2)} WETH
                    </LoanDetailData1Typography>
                  </Box>
                </Box>




                <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  mt:'20px'
                }}>
                  <LoanDetailLabelTypography>
                    Loan Amount
                  </LoanDetailLabelTypography>
                  <Box sx={{mt:'40px'}}>
                  <Slider 
                  min={lendingNFT.loanAmountMin} 
                  max={lendingNFT.loanAmountMax} 
                  valueLabelFormat={value=><div>{`${value} WETH`}</div>} 
                  step={lendingNFT.loanAmountSliderStep} 
                  valueLabelDisplay="on" 
                  value={loanAmount} 
                  onChange={handleChange} 
                  marks={[
                    {
                        value: lendingNFT.loanAmountMin,
                        label: `${lendingNFT.loanAmountMin}  WETH`
                    },
                    {
                        value: lendingNFT.loanAmountMax,
                        label: `${lendingNFT.loanAmountMax} WETH`
                    },
                  ]}
                  sx={{
                    '& .MuiSlider-markLabel':{
                      color:'rgba(255, 255, 255, 0.4)',
                      transform: "none"
                    },
                    'span.MuiSlider-markLabel[data-index="1"]':{
                      transform: "translateX(-100%)"
                    }
                  }}
                  // onChangeCommitted={changeRepaymentBaseOnLoanAmount}
                  />
                  </Box>
                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  mt:'20px'
                }}>
                  <LoanDetailLabelTypography>
                    Duration
                  </LoanDetailLabelTypography>
                  <Box sx={{mt:'40px'}}>
                  <Slider 
                  min={0} 
                  max={lendingNFT.durationMax} 
                  valueLabelFormat={value=><div>{`${value} days`}</div>} 
                  step={1} 
                  valueLabelDisplay="on" 
                  value={Number(durationSliderValue)} 
                  onChange={handleChangeDurationSlider} 
                  marks={[
                    {
                        value: 0,
                        label: `${0} days`
                    },
                    {
                        value: lendingNFT.durationMax,
                        label: `${lendingNFT.durationMax} days`
                    },
                  ]}
                  sx={{
                    '& .MuiSlider-markLabel':{
                      color:'rgba(255, 255, 255, 0.4)',
                      transform: "none"
                    },
                    'span.MuiSlider-markLabel[data-index="1"]':{
                      transform: "translateX(-100%)"
                    }
                  }}
                  // onChangeCommitted={changeRepaymentBaseOnDuration}
                  />
                  </Box>
                </Box>


                <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  mt:'20px'
                }}>
                  <LoanDetailLabelTypography>
                    Best Vault
                  </LoanDetailLabelTypography>
                  <Box onClick={handleClick} sx={{
                    display:'flex',
                    justifyContent:'flex-start',
                    color:'white',
                    background: "#1B1B21",
                    border: "1px solid #000000",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "5px",
                    paddingY:'20px',
                    paddingX:'16px',
                    fontWeight:'700',
                    mt:'10px',
                    cursor:'pointer',
                    '&:hover':{
                      boxShadow: "inset 0 0 20px 0px #121218"
                    }
                  }}>
                    {lendingNFT.avaliableVaultsStrs[selectedVaultIndex]}
                    <Box sx={{justifySelf:'flex-end',marginLeft:'auto',height:'30px',width:'30px',marginRight:'20px'}}>
                      <Image src="/static/images/icons/triangle-down.svg" layout="responsive" height="30px" width="30px" alt=""/>
                    </Box>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                      sx: { 
                        width: anchorEl && anchorEl.offsetWidth,
                        color:'white',
                        fontFamily:'DM Mono',
                      } 
                    }}
                    PaperProps={{
                      sx:{
                        // width:'100%'
                        background: "#1B1B21",
                        border: "1px solid #000000",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                        borderRadius: "5px",
                        color:'white',
                        width: anchorEl && anchorEl.offsetWidth,
                      }
                    }}

                  >
                     {
                      lendingNFT.avaliableVaultsStrs.map((vault,index)=>{
                        return(
                          <Box key={index}>
                            <LoanDetailBestVaultMenuItem onClick={()=>{handleClose();handleSelectVaultIndexChange(index);}}>{vault}</LoanDetailBestVaultMenuItem>
                            <LoanDetailBestVaultMenuItemDivier />
                          </Box>
                        )
                      })
                     }
                  </Menu>

                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'row',
                  mt:'20px',
                  gap:'50px'
                }}>

                  <Box sx={{width:'40%'}}>
                    <LoanDetailLabelTypography>
                      Loan Amount
                    </LoanDetailLabelTypography>
                    <Input 
                      value={loanAmount} 
                      type="number"
                      onChange={(e)=>{
                        if(e.target.value.split('.')[1]?.length > 2)
                          return
                        const number_input = +Number(e.target.value).toFixed(2);
                        if(number_input>=0 && number_input<=lendingNFT.loanAmountMax){
                          setLoanAmount(number_input);
                        }
                      }}
                      // onBlur={()=>{
                      //   changeRepaymentBaseOnLoanAmount();
                      // }}
                      sx={{
                        color:'white',
                        fontSize:'30px',
                        fontWeight:'700',
                        ':before': { borderBottomColor: 'rgba(255, 255, 255, 0.4)' },
                        // underline when selected
                        ':after': { borderBottomColor: 'white' },
                      }} endAdornment={<InputAdornment position="end">WETH</InputAdornment>}>
                    </Input>
                  </Box>

                  <Box sx={{width:'40%'}}>
                    <LoanDetailLabelTypography>
                      Duration
                    </LoanDetailLabelTypography>

                    <Input 
                    value={durationSliderValue} 
                    // type="number"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={(e)=>{
                      const number_input = Math.floor(Number(e.target.value))
                      if(number_input>=0 && number_input<=lendingNFT.durationMax){
                        console.log(typeof(number_input));
                        setDurationSliderValue(number_input);
                      }
                    }}
                    // onBlur={()=>{
                    //   changeRepaymentBaseOnDuration();
                    // }}
                    sx={{
                      color:'white',
                      fontSize:'30px',
                      fontWeight:'700',
                      ':before': { borderBottomColor: 'rgba(255, 255, 255, 0.4)' },
                      // underline when selected
                      ':after': { borderBottomColor: 'white' },
                    }} endAdornment={<InputAdornment position="end">Days</InputAdornment>}></Input>
                  </Box>
                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'row',
                  mt:'20px',
                  gap:'50px'
                }}>

                  <Box sx={{width:'40%'}}>
                    <LoanDetailLabelTypography>
                      Repayment
                    </LoanDetailLabelTypography>
                    <LoanDetailData1Typography>
                      {lendingNFT.repayment} WETH
                    </LoanDetailData1Typography>
                  </Box>

                  <Box sx={{width:'40%'}}>
                    <LoanDetailLabelTypography>
                      Repayment Date
                    </LoanDetailLabelTypography>
                    <LoanDetailData1Typography>
                      {lendingNFT.repaymentDate}
                    </LoanDetailData1Typography>
                  </Box>


                </Box>

                <Box sx={{
                  display:'flex',
                  flexDirection:'column',
                  mt:'20px',
                }}>

                  
                  <Button variant="contained" onClick={async ()=>{console.log(await takeLoan(lendingNFT, selectedVaultIndex))
                  //this should be collection address and current id
                }} sx={{width:'140px'}}>
                      Get Loan
                  </Button>

                </Box>

              </Box>
            </Box>
          </Box>
        </LoanDetailBox>
        }

      </Box>
    </>
  );
}

LoanDetailPage.getLayout = (page:any) => <DashboardLayout>{page}</DashboardLayout>;

export default LoanDetailPage;