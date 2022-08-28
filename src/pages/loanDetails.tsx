import {DashboardLayout} from 'src/components/Nav/dashboard-layout'
import Head from "next/head";
import { useState } from "react";
import {Button,Box,Grid, Typography, Slider, Divider, Menu, MenuItem} from "@mui/material";
import { VaultCard } from "src/components/Vaults/VaultCard";
import {styled, experimental_sx as sx} from '@mui/system';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { lendingNFT as not_redux_lendingNFT } from 'src/data/lendingNFT';

import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { selectLendingNFT,setLendingNFT } from 'src/redux/lendingNFTSlice';
import {getNFTDetails,getNFTFiUnderlying} from 'src/utils/contractFunctions';



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

  const [loanAmount, setLoanAmount] = useState<number | number[]>(0);

  const handleChange = (event: Event, value: number | number [], activeThumb: number) => {
    setLoanAmount(value);
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
                  border: "1px solid #FEDA84",
                  boxShadow: "3px 5px 13px -8px #FFC3AB",
                  borderRadius: "18px",
                  height:'100%',
                  overflow: 'clip'
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
                <Box sx={{
                  display:'flex',
                  flexDirection:'column'
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
                  mt:'20px'
                }}>
                  <LoanDetailLabelTypography>
                    NFT Valuation
                  </LoanDetailLabelTypography>
                  <LoanDetailData1Typography>
                    {lendingNFT.valuation} WETH
                  </LoanDetailData1Typography>
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
                  <Slider min={lendingNFT.loanAmountMin} max={lendingNFT.loanAmountMax} valueLabelFormat={value=><div>{`${value} WETH`}</div>} step={lendingNFT.loanAmountSliderStep} valueLabelDisplay="on" value={loanAmount} onChange={handleChange} />
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
                            <LoanDetailBestVaultMenuItem onClick={()=>{handleClose();setSelectedVaultIndex(index)}}>{vault}</LoanDetailBestVaultMenuItem>
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
                  mt:'50px',
                  justifyContent: 'space-between'
                }}>

                  <Box>
                    <LoanDetailLabelTypography>
                      Repayment
                    </LoanDetailLabelTypography>
                    <LoanDetailData1Typography>
                      {lendingNFT.repayment} WEth
                    </LoanDetailData1Typography>
                  </Box>

                  <Box>
                    <LoanDetailLabelTypography>
                      Duration
                    </LoanDetailLabelTypography>
                    <LoanDetailData1Typography>
                      {console.log(lendingNFT)}
                      {lendingNFT.duration} Days
                    </LoanDetailData1Typography>
                  </Box>

                  <Box>
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
                  marginTop:'auto'
                }}>

                  
                  <Button variant="contained" onClick={async ()=>{console.log(await getNFTFiUnderlying('0xf896527c49b44aAb3Cf22aE356Fa3AF8E331F280', '14358716824499463741'))
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