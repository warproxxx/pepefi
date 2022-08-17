import {
    Button,
    Box,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import { VaultOverViewChart } from "src/components/Vaults/VaultOverviewChart";
import { styled, experimental_sx as sx } from '@mui/system';


const statusToColor = {
    'active': {
        backgroundColor: 'rgba(43, 169, 114, 0.2)',
        color: '#2ba972'
    },
    'ready': {
        backgroundColor: 'rgb(255 194 37 / 20%)',
        color: 'rgb(191 144 25);'
    },
    'disabled' : {
        backgroundColor: 'rgba(43, 169, 114, 0.2)',
        color: '#2ba972' 
    }
}



export const VaultsCard = styled(Card)((props)  => sx({
  
}));

export const VaultsCardContent = styled(CardContent)((props)  => sx({
  
}));

export const VaultsCardNameTypography = styled(Typography)((props)  => sx({
  color: props.maincolor,
  fontSize:'24px',
  fontWeight: 'bold',
  mt:'10px'
}));

export const VaultsCardDataTypography = styled(Typography)((props)  => sx({
  fontSize:'14px',
  fontWeight: 'normal',
  color:'#A2A2A2',

}));

export const VaultsCardDataActiveTypography = styled(Typography)((props)  => sx({
    fontSize:'17px',
    fontWeight: 'normal',
    color: statusToColor[props.status]['color'],
    backgroundColor: statusToColor[props.status]['backgroundColor'],
    "borderRadius":"4px",
    "display":"flex",
    "alignItems":"center",
    "padding":"4px 8px",
    textTransform:'capitalize',
    '&::before':{
      "content":'""',
      backgroundColor: statusToColor[props.status]['color'],
      "width":"4px",
      "height":"4px",
      "borderRadius":"50%",
      "marginRight":"4px"
    }
}));
  

const svgStroke = "#A2A2A2"
const questionMarkSvg = (
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M6.06 6a2 2 0 013.887.667c0 1.333-2 2-2 2" stroke={svgStroke} strokeLinecap="round" strokeLinejoin="round">
    </path>
    <path clipRule="evenodd" d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334z" stroke={svgStroke} strokeLinecap="round" strokeLinejoin="round">
    </path>
    <circle cx="8" cy="11.333" stroke={svgStroke} r="0.667">
    </circle>
</svg>
)



export const VaultCard = (props) => {
    const plotData = props.data;
    const mainColor = props.mainColor;
    const vaultName = props.vaultName;
    const volume = props.Volume;
    const apr = props.apr;
    const status = props.status;


    return(
        <VaultsCard sx={{
        }}>
            <VaultsCardContent>
                <Box>
                {/* <VaultOverViewChart data={props.data}/> */}
                </Box>
                <VaultsCardNameTypography maincolor={props.mainColor}>
                {props.vaultName}
                </VaultsCardNameTypography>
                <Box sx={{my:"15px"}}>
                <Box sx={{display:'flex',justifyContent:'space-between',my:'7px'}}>
                    <Box sx={{display:'flex'}}>
                        <VaultsCardDataTypography>
                            Total WETH: 
                        </VaultsCardDataTypography>
                        <Box sx={{mx:'2px'}}></Box>
                        <Box sx={{display:'flex',alignItems:'center',cursor:'pointer'}}>
                            {questionMarkSvg}
                        </Box>

                    </Box>
                    <VaultsCardDataTypography>
                        {props.volume} WETH
                    </VaultsCardDataTypography>
                </Box>
                <Box sx={{display:'flex',justifyContent:'space-between',my:'7px'}}>
                <Box sx={{display:'flex'}}>
                        <VaultsCardDataTypography>
                            Expected APR: 
                        </VaultsCardDataTypography>
                        <Box sx={{mx:'2px'}}></Box>
                        <Box sx={{display:'flex',alignItems:'center',cursor:'pointer'}}>
                            {questionMarkSvg}
                        </Box>

                    </Box>
                    <VaultsCardDataTypography>
                        {props.apr}%
                    </VaultsCardDataTypography>
                </Box>
                <Box sx={{display:'flex',justifyContent:'space-between',my:'7px'}}>
                    <Box sx={{display:'flex'}}>
                        <VaultsCardDataTypography>
                            LTV: 
                        </VaultsCardDataTypography>
                        <Box sx={{mx:'2px'}}></Box>
                        <Box sx={{display:'flex',alignItems:'center',cursor:'pointer'}}>
                            {questionMarkSvg}
                        </Box>

                    </Box>
                    <VaultsCardDataTypography>
                        {"40"} %
                    </VaultsCardDataTypography>
                </Box>
                {/* <Box sx={{display:'flex',justifyContent:'space-between',my:'7px'}}>
                    <VaultsCardDataTypography>
                        Status: 
                    </VaultsCardDataTypography>
                    <VaultsCardDataActiveTypography status={props.status}>
                        {props.status}
                    </VaultsCardDataActiveTypography>
                </Box> */}
                </Box>

                <Box sx={{width:'100%',display:'flex',justifyContent:'flex-end',mt:'20px'}}>
                <Button variant="contained" onClick={()=>props.handleVaultDetailPopupClickOpen()}>
                    Details
                </Button>
                </Box>
            </VaultsCardContent>
        </VaultsCard>
    )
    
}