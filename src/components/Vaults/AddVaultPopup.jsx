import { useState,forwardRef } from "react";
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
  Divider
} from "@mui/material";

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { styled, experimental_sx as sx } from '@mui/system';

import {truncateAddress} from '../../utils/helpers'


  const steps = [
    'Gerneral Info',
    'Vault Details',
    'Confirmation',
  ];
  
  const inputs = [
    "Vault Name",
    "Vault Manager Address",
    "Initial Vault Deposit",
    "Imbalance Threshold",
    "Imbalance Ratio"
  ]

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  export const QuestionTextField = styled(TextField)((props)  => sx({
    '& .MuiFilledInput-root': {
      backgroundColor: 'white'
    }
  }));

  export const AddVaultPopupQuestionTextField = styled(QuestionTextField)((props)  => sx({
    '& .MuiFilledInput-root':{
      backgroundColor: '#0A0C0B',
      color: 'white',
      border: "2px solid #3D3C40",
      borderRadius: "5px"
    },
    '& .MuiFilledInput-root:after':{
      border:'none'
    },
  }));

const defaultCollectionDetails = {
  collectionAddress: '',
  collectionLTV: '5',
  collectionAPR: '3'
}

export const AddVaultPopup = (props) => {
    
    const [activeStep, setActiveStep] = useState(0);
    
    
    const [showAddCollection, setShowAddcollection] = useState(false);
    const [collectionDetail,setCollectionDetail] = useState(defaultCollectionDetails)
    const [collections,setCollections] = useState([]);

    const handleSetCollectionDetail = (prop) => (event) => {
      setCollectionDetail({ ...collectionDetail, [prop]: event.target.value});
    };

    const handleAddCollection = () =>{
      setCollections([...collections,collectionDetail])
    }

    const [datePickerVaule, setDatePickerValue] = useState(new Date());
    const handleDatePickerValueChange = (value) => {
      setDatePickerValue(value);
    }

    const handleNext = () => {
      if(activeStep==2)
        return;
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    const handleBack = () => {
      if(activeStep==0)
        return;
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const [values, setValues] = useState({
      vaultName: '',
      vaultManagerAddress: '',
      fundSize: '0',
      riskTolerance: '5',
      vigorish: '3',
      allowExternalLP: true
    });
  
    const handleChange = (prop) => (event) => {
      if(prop=="allowExternalLP"){
        setValues({ ...values, [prop]: event.target.checked ? true: false });
      }
      else{
        setValues({ ...values, [prop]: event.target.value });
      }


    };

    return (
        <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClose}
        PaperProps={{
          sx:{
            minWidth:'700px',
            background: "#18181833",
            boxShadow: "3px 11px 3px rgba(0, 0, 0, 0.25)",
            backdropFilter:"blur(30px)",
            borderRadius: "20px",
            alignItems: "center",
            fontFamily:'DM Mono'
          }
        }}
        
      >
        <DialogTitle sx={{color:'white',alignSelf: 'center'}}>{"Create Vault"}</DialogTitle>
        <DialogContent sx={{width:'70%'}}>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{
              '& .MuiStepLabel-label':{
                color:'white'
              },
              '& .MuiStepLabel-label.Mui-active':{
                color:'#5dc961'
              },
            }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box sx={{
            backgroundColor: '#00000000',
            borderRadius: "8px",
            paddingX: '20px',
            paddingY: '20px',
            mt:'20px'
          }}>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{minHeight:'263px'}}
              >
              { activeStep == 0 ? 
                <Box sx={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <AddVaultPopupQuestionTextField
                  label={inputs[0]}
                  variant="filled"
                  margin="normal"
                  value={values.vaultName}
                  onChange={handleChange('vaultName')}
                />
                <AddVaultPopupQuestionTextField
                  label={inputs[1]}
                  variant="filled"
                  margin="normal"
                  value={values.providerAddress}
                  onChange={handleChange('providerAddress')}
                  placeholder="0x000...000"
                />
              <AddVaultPopupQuestionTextField
                  label={inputs[2]}
                  variant="filled"
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">WETH</InputAdornment>,
                  }}
                  value={values.fundSize}
                  onChange={handleChange('fundSize')}
              />
              </Box>            
              : 
                  void(0)
              }

              
              { activeStep == 1 ? 
                <Box sx={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="h5">NFT Collections</Typography>
                <Box sx={{mb:'20px'}}>
                  {
                    collections.map((collection,index)=>{
                      return(
                        <Box sx={{"background":"#1B1B21","boxShadow":"0px 5px 2px 1px rgba(0, 0, 0, 0.25)","borderRadius":"8px",px:'10px',py:'5px',mt:'10px'}} key={index}>
                          <Typography >
                            {`${index+1}: ${truncateAddress(collection.collectionAddress)}, ${collection.collectionLTV}% LTV, ${collection.collectionAPR}% APR`}
                          </Typography>
                        </Box>

                      )
                    })
                  }
                </Box>

                {showAddCollection ?
                <Box sx={{"background":"#ffffff0a","boxShadow":"0px 5px 2px 1px rgb(0 0 0 / 25%)","borderRadius":"8px","py":"10px",mb:'20px',px:'20px'}}>
                  <Typography>New Collection</Typography>
                  <Tooltip title={"Ethereum contract address for the collection"} 
                    arrow 
                    disableFocusListener 
                    disableTouchListener 
                    enterDelay={700}
                    placement="top">
                    <AddVaultPopupQuestionTextField
                        label={"collection address"}
                        variant="filled"
                        margin="normal"
                        fullWidth
                        placeholder="0x000...000"
                        value={collectionDetail.collectionAddress}
                        onChange={handleSetCollectionDetail('collectionAddress')}
                      />
                    </Tooltip>
                    <Tooltip title={"Collection LTV"} 
                      arrow 
                      disableFocusListener 
                      fullWidth
                      disableTouchListener 
                      enterDelay={700}
                      placement="top">
                      <AddVaultPopupQuestionTextField
                          label={"collection LTV"}
                          variant="filled"
                          margin="normal"
                          placeholder="5"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          value={collectionDetail.collectionLTV}
                          onChange={handleSetCollectionDetail('collectionLTV')}
                        />
                      </Tooltip>
                        <Tooltip title={"collection APR"} 
                        arrow 
                        disableFocusListener 
                        fullWidth
                        disableTouchListener 
                        enterDelay={700}
                        placement="top">
                        <AddVaultPopupQuestionTextField
                            label={"collection APR"}
                            variant="filled"
                            margin="normal"
                            placeholder="5"
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            value={collectionDetail.collectionAPR}
                            onChange={handleSetCollectionDetail('collectionAPR')}
                          />
                        </Tooltip>
                  <Box sx={{display:'flex',justifyContent:'center',marginTop:'10px'}}>
                  <Button 
                    onClick={()=>{
                      setShowAddcollection(false);setCollectionDetail(defaultCollectionDetails)
                    }}
                    sx={{
                      color:'white',
                      padding:'0px',
                      '&:hover':{
                        'backgroundColor':'transparent',
                        color:'#5dc961'

                      }
                    }}>Cancel</Button>
                    <Button 
                    onClick={()=>{
                      handleAddCollection();setShowAddcollection(false);setCollectionDetail(defaultCollectionDetails)
                    }}
                    sx={{
                      color:'white',
                      padding:'0px',
                      '&:hover':{
                        'backgroundColor':'transparent',
                        color:'#5dc961'

                      }
                    }}>Add</Button>
                  </Box>

                </Box> 
                : 
                void(0)
                }



                <Box sx={{display:'flex',justifyContent:'space-between',mb:'8px',alignItems:'center'}}>
                  <Typography sx={{textDecoration: 'underline',cursor:'pointer'}} onClick={()=>(setShowAddcollection(true))}>Add One Collection</Typography>
                </Box>
                
                <Typography variant="h5" sx={{mt:'50px'}}>Misc.</Typography>
                <Box sx={{display:'flex',justifyContent:'space-between',mt:'0px',mb:'0px',alignItems:'center'}}>
                  <Typography>Vault Expired Date</Typography>
                  <Box sx={{
                    width:'40%',
                    "& .MuiSvgIcon-root":{
                      color:'#5dc961'
                    }
                  }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                          inputFormat="MM/dd/yyyy"
                          value={datePickerVaule}
                          onChange={(handleDatePickerValueChange)}
                          renderInput={(params) => <TextField {...params} />}

                        />
                    </LocalizationProvider>
                  </Box>



                </Box>

                <Box sx={{display:'flex',justifyContent:'space-between',mt:'16px',mb:'8px',alignItems:'center'}}>
                  <Typography>Allow external LP?</Typography>
                  <Checkbox checked={values.allowExternalLP} onChange={handleChange("allowExternalLP")} />
                </Box>
              </Box>            
              : 
                  void(0)
              }


              { activeStep == 2 ? 
                <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                mt:'20px'
              }}>
              {
                inputs.map((input,index)=>{
                  return(
                    <Box sx={{display: 'flex', justifyContent:'space-between'}} key={index}>
                      <Typography sx={{}}>
                        {input}:
                      </Typography>
                      <Typography sx={{color: "#5dc961",fontWeight: "bold", width:`${index==1 ? '70%' : 'auto'}`, overflowX: 'auto'}}>
                        {Object.values(values)[index]}
                        {index==2  ? ' WETH' : ''}
                        {index==3 || index==4 ? '%' : ''}
                      </Typography>
                    </Box>
                  )
                })
              }


              </Box>            
              : 
                  void(0)
              }
              
            </Box>
          </Box>


        </DialogContent>
        <DialogActions>
        {
          activeStep != 0 
          ?
          <Button onClick={()=>handleBack()}>
                Back
          </Button>
          :
          void(0)
        }

        {
          activeStep != 2
          ?
          <Button onClick={()=>handleNext()}>
                Next
          </Button>
          :
          void(0)
        }
        {
          activeStep == 2
          ?
          <Button onClick={()=>{}}>
                Finish
          </Button>
          :
          void(0)
        }
        </DialogActions>
      </Dialog>
    )
}