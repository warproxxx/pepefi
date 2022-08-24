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
  Tooltip
} from "@mui/material";
import { styled, experimental_sx as sx } from '@mui/system';


  const steps = [
    'Gerneral Info',
    'Vault Details',
    'Confirmation',
  ];
  
  const inputs = [
    "Vault Name",
    "Provider Address",
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



export const AddVaultPopup = (props) => {
    
    const [activeStep, setActiveStep] = useState(0);

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
      providerAddress: '',
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
              // '& .MuiStepConnector-alternativeLabel.Mui-active span':{
              //   borderColor:'#5dc961'
              // }
            }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box sx={{
            // background: "#1B1B21",
            // boxShadow: "0px 5px 2px 1px rgba(0, 0, 0, 0.25)",
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
                  color="secondary"
                />
                <AddVaultPopupQuestionTextField
                  label={inputs[1]}
                  variant="filled"
                  margin="normal"
                  value={values.providerAddress}
                  onChange={handleChange('providerAddress')}
                  placeholder="0x000...000"
                  helperText="Ethereum address that will provide odds"
                  color="secondary"
                />
              <AddVaultPopupQuestionTextField
                  label={inputs[2]}
                  variant="filled"
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">DAI</InputAdornment>,
                  }}
                  value={values.fundSize}
                  onChange={handleChange('fundSize')}
                  color="secondary"
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
              <Tooltip title={"This is  % of total liquidity betted in a single outcome after which the inbalance ratio check and limit will kick off."} 
              arrow 
              disableFocusListener 
              disableTouchListener 
              enterDelay={700}
              placement="top">
              <AddVaultPopupQuestionTextField
                    label={inputs[3]}
                    variant="filled"
                    margin="normal"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      inputMode: 'numeric', 
                      pattern: '[0-9]*' 
                    }}
                    value={values.riskTolerance}
                    onChange={handleChange('riskTolerance')}
                    InputLabelProps={{
                      sx:{
                        display:'flex !important',
                        '&::after':{
                            content: `"?"`,
                            color: 'black',
                            justifySelf:'flex-end'
                        }
                      }
                    }}
                  />
              </Tooltip>

              <Tooltip title={"If the imbalance threshold has been met and one outcome gets n% of the bets, stop taking bet in that outcome, where is the number selected."} 
              arrow 
              disableFocusListener 
              disableTouchListener 
              enterDelay={700}
              placement="top">
              <AddVaultPopupQuestionTextField
                  label={inputs[4]}
                  variant="filled"
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputMode: 'numeric', 
                    pattern: '[0-9]*' 
                  }}
                  value={values.vigorish}
                  onChange={handleChange('vigorish')}
                />
              </Tooltip>



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