import {
    Button,
    Box,
    Typography,
    Card,
    CardContent,
    Slider,
    Tooltip
} from "@mui/material";
import { VaultOverViewChart } from "src/components/Vaults/VaultOverviewChart";
import { styled, experimental_sx as sx } from '@mui/system';
import Image from 'next/image'
import { useRouter } from "next/router";


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
  mt:'17px',
  mb:'10px',
  fontFamily:'inherit'
}));

export const VaultsCardDataTypography = styled(Typography)((props)  => sx({
  fontSize:'14px',
  fontWeight: 'normal',
  color:'#A2A2A2',
  fontFamily:'inherit'
}));

export const VaultsCardDataNumberTypography = styled(Typography)((props)  => sx({
    fontSize:'14px',
    fontWeight: 'normal',
    color:'white',
    fontFamily:'inherit'
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
  
export const CollectionPictureBox = styled(Box)((props)  => sx({
    aspectRatio: "1.68 / 1",
    width:'50%',
    padding:'5px',
}));

export const CollectionPictureInnerBox = styled(Box)((props)  => sx({
    borderRadius: "10px",
    overflow: "auto"
}));

export const RangeSlider = styled(Slider)((props)  => sx({
    cursor:'initial',
    height:'1px',
    marginBottom: "0px",
    '& .MuiSlider-markLabel':{
        color:'#A2A2A2',
        top:"20px",
        fontSize:'10px'
    },
    '& .MuiSlider-thumb':{
        display:"none"
    },
    '& .MuiSlider-mark':{
        backgroundColor: "#5DC961",
        height: "10px",
        boxShadow: "0px 0px 3px 0.5px #5DC961"
    },
    '& .MuiSlider-track':{
        height: "1px",
        boxShadow: "0px 0px 3px 0.5px #5dc961"
    },
    '& .MuiSlider-rail':{
        backgroundColor:"#939393",
        height: "1px"
    },
    '& :nth-child(3), & :nth-child(7)':{
        width:'7px',
        height:'7px',
        borderRadius:'50%'
    }


}));


const svgStroke = "#A2A2A2"
const questionMarkSvg = (description="some tips here") =>{
    return(
        <Tooltip title={description}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6.06 6a2 2 0 013.887.667c0 1.333-2 2-2 2" stroke={svgStroke} strokeLinecap="round" strokeLinejoin="round">
            </path>
            <path clipRule="evenodd" d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334z" stroke={svgStroke} strokeLinecap="round" strokeLinejoin="round">
            </path>
            <circle cx="8" cy="11.333" stroke={svgStroke} r="0.667">
            </circle>
        </svg>
        </Tooltip>
        
        )
} 

const vaultCardRows = [
    {
        name:'Total WETH',
        description: 'Total WETH tooltip description',
        unit: 'WETH'
    },
]
const vaultCardSliderRows = [
    {
        name:'LTV',
        dataName: 'LTV',
        description: 'LTV tooltip description',
        unit:'%',
    },
    {
        name:'APR',
        dataName: 'APR',
        description: 'APR tooltip description',
        unit:'%',
    },
    {
        name:'Duration',
        dataName:'duration',
        description: 'Duration tooltip description',
        unit:'day',
    },
]

export const VaultCard = (props) => {
    const vault = props.vault;
    const router = useRouter();

    return(
        <Card sx={{ 
            background: "linear-gradient(#071631, #242435)",
            fontFamily:"DM Mono",
            boxShadow: "3px 3px 16px 3px rgb(100 116 139 / 13%), 0px 1px 2px 0px rgb(100 116 139 / 10%)",
            '&:hover':{
                boxShadow: "3px 3px 20px 8px rgb(84 128 191 / 12%), 0px 1px 2px 0px rgb(100 116 139 / 10%)", 
            }
        }}>
            <VaultsCardContent sx={{backgroundColor: "inherit", padding:'25px'}}>
                <Box sx={{
                    border: "1px solid #7CE7FF",
                    boxShadow: "3px 5px 14px -2px rgba(97, 233, 241, 0.25)",
                    borderRadius: "18px",
                    px:'20px',
                    py:'10px'
                }}>
                {/* <VaultOverViewChart data={props.data}/> */}
                    <Box sx={{
                        display:'flex'
                    }}>
                        <CollectionPictureBox>
                            <CollectionPictureInnerBox>
                                <Image src={vault.data.imgSrc[0]} layout="responsive" height="100%" width="100%"></Image>
                            </CollectionPictureInnerBox>
                        </CollectionPictureBox>

                        <CollectionPictureBox>
                            <CollectionPictureInnerBox>
                                <Image src={vault.data.imgSrc[1]} layout="responsive" height="100%" width="100%"></Image>
                            </CollectionPictureInnerBox>
                        </CollectionPictureBox>
                    </Box>

                    <Box sx={{
                        display:'flex'
                    }}>
                        <CollectionPictureBox>
                            <CollectionPictureInnerBox>
                                <Image src={vault.data.imgSrc[2]} layout="responsive" height="100%" width="100%"></Image>
                            </CollectionPictureInnerBox>
                        </CollectionPictureBox>

                        <CollectionPictureBox>
                            <CollectionPictureInnerBox>
                                <Image src={vault.data.imgSrc[3]} layout="responsive" height="100%" width="100%"></Image>
                            </CollectionPictureInnerBox>
                        </CollectionPictureBox>
                    </Box>

                </Box>
                <Box sx={{my:"15px"}}>
                    <Box sx={{display:'flex',justifyContent:'space-between',my:'7px'}}>
                        <Box sx={{display:'flex'}}>
                            <VaultsCardDataTypography>
                                {vaultCardRows[0].name}:
                            </VaultsCardDataTypography>
                            <Box sx={{mx:'2px'}}></Box>
                            <Box sx={{display:'flex',alignItems:'center',cursor:'pointer'}}>
                                {questionMarkSvg(vaultCardRows[0].description)}
                            </Box>

                        </Box>
                        <VaultsCardDataNumberTypography>
                            {`${vault.data.totalWETH} ${vaultCardRows[0].unit}`}
                        </VaultsCardDataNumberTypography>
                    </Box>
                    {
                        vaultCardSliderRows.map((row,index)=>{
                            return(
                                <Box sx={{display:'flex',justifyContent:'space-between',my:'7px',alignItems: 'center'}} key={index}>
                                    <Box sx={{display:'flex'}}>
                                        <VaultsCardDataTypography>
                                            {row.name}:
                                        </VaultsCardDataTypography>
                                        <Box sx={{mx:'2px'}}></Box>
                                        <Box sx={{display:'flex',alignItems:'center',cursor:'pointer'}}>
                                            {questionMarkSvg(row.description)}
                                        </Box>

                                    </Box>

                                    <Box sx={{width:'70%'}}>
                                        <RangeSlider
                                            value={vault.data[row.dataName].range}
                                            min={vault.data[row.dataName].min}
                                            max={vault.data[row.dataName].max}
                                            marks={vault.data[row.dataName].marks}
                                        />  
                                    </Box>

                                </Box>
                            )
                        })
                    }
                </Box>

                <Box sx={{width:'100%',display:'flex',justifyContent:'flex-end',mt:'40px'}}>
                    <Button variant="contained" onClick={()=>router.push('/vaultDetails')}>
                        Visit Vault
                    </Button>
                </Box>

            </VaultsCardContent>
        </Card>
    )
    
}