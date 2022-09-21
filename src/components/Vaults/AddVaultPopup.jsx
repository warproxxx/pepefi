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
  Divider
} from "@mui/material";
import AddVaultPopupCollectionSearch from "./AddVaultPopupCollectionSearch";

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { styled, experimental_sx as sx } from '@mui/system';

import {truncateAddress,camelCaseToSpace} from '../../utils/helpers'
import { tooltipDelay } from "src/constants/tooltip";

import { selectWallets } from "src/redux/walletsSlice";
import { useAppSelector,useAppDispatch } from 'src/app/hooks';

import {addVault} from 'src/utils/contractFunctions.js'

import { selectLoading, setLoadingState, setOpen, setSuccecss, setTitle } from "src/redux/loadingSlice";

import Image from "next/image";

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

  export const AddVaultPopupQuestionTextField = styled(QuestionTextField)((props)  => 
  {
    let border = "2px solid #3D3C40"
    let helperTextColor = 'white';
    if(props.customerror){
      props.customerror == "false" ? border = "2px solid #3D3C40" : border = `2px solid ${props.theme.palette.error.main}`
      props.customerror == "false" ? helperTextColor = `${props.theme.palette.text.primary}` : helperTextColor = `${props.theme.palette.error.main}`
    }
    return(
    sx({
    '& .MuiFilledInput-root':{
      backgroundColor: '#0A0C0B',
      color: 'white',
      border: border,
      borderRadius: "5px"
    },
    '& .MuiFilledInput-root:after':{
      border:'none'
    },
    '& .MuiFormHelperText-root':{
      color:helperTextColor
    },
  })
)});

const defaultCollectionDetails = {
  collectionName: '',
  collectionAddress: '',
  collectionLTV: '50',
  collectionAPR: '30'
}

const defaultValues = {
  vaultName: '',
  vaultManagerAddress: '',
  initialVaultDeposit: '0',
  allowExternalLP: true
}

const defaultCollectionDetailsError = {
  collectionLTV: false,
  collectionAPR: false
}

export const AddVaultPopup = (props) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loadingAfterConfirm, setLoadingAfterConfirm] = useState(false);
    const [addVaultSuccess, setAddVaultSuccess] = useState(false);

    const [showAddCollection, setShowAddcollection] = useState(false);
    const [collectionDetail,setCollectionDetail] = useState(defaultCollectionDetails)
    const [collectionDetailError, setCollectionDetailError] = useState(defaultCollectionDetailsError)
    const [collections,setCollections] = useState([]);

    const loadingState = useAppSelector(selectLoading);
    const dispatch = useAppDispatch();


    const handleSetCollectionDetail = (prop) => (event) => {
      const value = event.target.value;
      if(prop == 'collectionAPR'){
        if(Number.isNaN(Number(value)))
          return;
        if(Number(value) > 1000 || Number(value) < 0){
          setCollectionDetailError({ ...collectionDetailError, [prop]: true});
          setTimeout(()=>{
            setCollectionDetailError({ ...collectionDetailError, [prop]: false});
          },3000)
          return
        }
        else
          setCollectionDetailError({ ...collectionDetailError, [prop]: false});
      }
      else if(prop == 'collectionLTV') {
        if(Number.isNaN(Number(value)))
          return;
        if(Number(value) > 100 || Number(value) < 0){
          setCollectionDetailError({ ...collectionDetailError, [prop]: true});
          setTimeout(()=>{
            setCollectionDetailError({ ...collectionDetailError, [prop]: false});
          },3000)
          return
        }
        else
          setCollectionDetailError({ ...collectionDetailError, [prop]: false});
      }


      setCollectionDetail({ ...collectionDetail, [prop]: event.target.value});
    };

    const setSelectedCollectionAddressAndName = (address,name="") => {
      setCollectionDetail({ ...collectionDetail, collectionAddress: address, collectionName:name});
    }

    const handleAddCollection = () =>{
      setCollections([...collections,collectionDetail])
    }

    const [datePickerVaule, setDatePickerValue] = useState(new Date(new Date().getFullYear(),
                                                            new Date().getMonth() + 2, 
                                                            new Date().getDate()));
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

    const wallets = useAppSelector(selectWallets);
    const [values, setValues] = useState(defaultValues);
  
    const handleChange = (prop) => (event) => {
      if(prop=="allowExternalLP"){
        setValues({ ...values, [prop]: event.target.checked ? true: false });
      }
      else{
        setValues({ ...values, [prop]: event.target.value });
      }
    };

    const resetEverything = () =>{
      setValues(defaultValues);
      setCollectionDetail(defaultCollectionDetails);
      setActiveStep(0);
      setCollections([]);
    }

    useEffect(()=>{
      setValues({ ...values, ['vaultManagerAddress']: wallets.account});
    },[wallets.account])


    const finishAddVault = async () => {
      finalFormReturnValues['collectionsAddressArray'] = []
      finalFormReturnValues['collectionsLTVArray'] = []
      finalFormReturnValues['collectionsAPRArray'] = []
      finalFormReturnValues.collections.map((collection,index)=>{
        finalFormReturnValues['collectionsAddressArray'].push(collection.collectionAddress);
        finalFormReturnValues['collectionsLTVArray'].push(collection.collectionLTV * 10); //doing this as solidity expects in this format
        finalFormReturnValues['collectionsAPRArray'].push(collection.collectionAPR * 10); //doing this as solidity expects in this format
      })

      //Initial transcation result
      let addVaultContractSuccess = false;

      // Close current modal
      props.handleClose()

      // Open loading modal with a set method
      dispatch(setLoadingState({open: true, loading: true, success: false}))

      // Wait for the transaction to be mined
      try{
        addVaultContractSuccess = await addVault(finalFormReturnValues)
        if (addVaultContractSuccess) {
          dispatch(setTitle("Waiting For Transaction To Be Mined"))
        }
  
        else{
          dispatch(setLoadingState({loading: false, success: false}))
        }
      }
      catch(e){
        console.error(e);
        dispatch(setLoadingState({loading: false, success: false}))
      }
    }

    let finalFormReturnValues = {
      vaultName: values.vaultName,
      vaultManagerAddress: values.vaultManagerAddress,
      initialVaultDeposit: values.initialVaultDeposit,
      collections: collections,
      expiredDate: datePickerVaule.toLocaleDateString(),
      allowExternalLP: values.allowExternalLP,
    }

    const page0Content = (
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
          <Tooltip title={"Vault manager address is the address of ..."} 
            arrow 
            disableFocusListener 
            disableTouchListener 
            enterDelay={tooltipDelay}
            placement="top">
              <AddVaultPopupQuestionTextField
                label={inputs[1]}
                variant="filled"
                margin="normal"
                value={values.vaultManagerAddress}
                onChange={handleChange('vaultManagerAddress')}
                placeholder="0x000...000"
              />
          </Tooltip>
      <Tooltip title={"Initial vault deposit is ..."} 
        arrow 
        disableFocusListener 
        disableTouchListener 
        enterDelay={tooltipDelay}
        placement="top">
        <AddVaultPopupQuestionTextField
            label={inputs[2]}
            variant="filled"
            margin="normal"
            InputProps={{
              endAdornment: <InputAdornment position="end">WETH</InputAdornment>,
            }}
            value={values.initialVaultDeposit}
            onChange={handleChange('initialVaultDeposit')}
        />
      </Tooltip>
      </Box>        
    )

    const page1Content = (
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
                    {`${collection.collectionName}, ${truncateAddress(collection.collectionAddress)}`}
                  </Typography>
                  <Typography >
                    {`${collection.collectionLTV}% LTV, ${collection.collectionAPR}% APR`}
                  </Typography>
                </Box>
              )
            })
          }
        </Box>

        {showAddCollection ?
        <Box sx={{"background":"#ffffff0a","boxShadow":"-4px 5px 2px 1px rgb(0 0 0 / 10%)","borderRadius":"8px","py":"10px",mb:'20px',px:'20px'}}>
          <Typography>New Collection</Typography>
            <AddVaultPopupCollectionSearch value={collectionDetail.collectionAddress} setSelectedCollectionAddressAndName={setSelectedCollectionAddressAndName}/>
            <Tooltip title={"Collection Name ..."} 
              arrow 
              disableFocusListener 
              fullWidth
              disableTouchListener 
              enterDelay={tooltipDelay}
              placement="top">
              <AddVaultPopupQuestionTextField
                  label={"Collection name"}
                  variant="filled"
                  margin="normal"
                  value={collectionDetail.collectionName}
                  onChange={handleSetCollectionDetail('collectionName')}
                />
            </Tooltip>
            <Tooltip title={"Collection LTV is numbers only, between 0 - 100"} 
              arrow 
              disableFocusListener 
              fullWidth
              disableTouchListener 
              enterDelay={tooltipDelay}
              placement="top">
              <AddVaultPopupQuestionTextField
                  label={"LTV"}
                  variant="filled"
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  value={collectionDetail.collectionLTV}
                  helperText={collectionDetailError.collectionLTV ? "Numbers only, 0 - 100" : ""}
                  onChange={handleSetCollectionDetail('collectionLTV')}
                  customerror={collectionDetailError.collectionLTV.toString() }
                />
            </Tooltip>
            <Tooltip title={"APR is percentage only, between 0 - 1000"} 
            arrow 
            disableFocusListener 
            fullWidth
            disableTouchListener 
            enterDelay={tooltipDelay}
            placement="top">
            <AddVaultPopupQuestionTextField
                label={"APR"}
                variant="filled"
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                value={collectionDetail.collectionAPR}
                helperText={collectionDetailError.collectionAPR ? "Numbers only, 0 - 1000" : ""}
                onChange={handleSetCollectionDetail('collectionAPR')}
                customerror={collectionDetailError.collectionAPR.toString() }
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
          <Typography sx={{textDecoration: 'underline',cursor:'pointer'}} onClick={()=>(setShowAddcollection(true))}>Add NFT Collection</Typography>
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
    )

    const page2Content = (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        mt:'20px'
      }}>
      {
        Object.keys(finalFormReturnValues).map((key,index)=>{
          let value = finalFormReturnValues[key]
          return(
            <Box sx={{display: 'flex', justifyContent:'space-between',flexDirection:`${key=="collections" ? "column" : "row"}`}} key={index}>
              <Typography sx={{}}>
                {camelCaseToSpace(key)}:
              </Typography>
              <Box sx={{color: "#5dc961",fontWeight: "bold", width:`${key=="collections" ? "100%" : "30%"}`, overflowX: 'auto'}}>
                {/* {Object.values(values)[index]}
                {index==2  ? ' WETH' : ''}
                {index==3 || index==4 ? '%' : ''} */}
              {/* {typeof(value) == 'object' ? void(0) : <Typography>{value}</Typography>} */}
              {key === 'vaultName' ? value : void(0)}
              {key === 'vaultManagerAddress' ? truncateAddress(value) : void(0)}
              {key === 'initialVaultDeposit' ? `${value} WETH` : void(0)}

              {key === 'collections' ? 
              <Box sx={{mb:'20px'}}>
                {
                  value.map((collection,index)=>{
                    return(
                      <Box sx={{"background":"#1B1B21","boxShadow":"-4px 5px 2px 1px rgb(0 0 0 / 10%)","borderRadius":"8px",px:'10px',py:'5px',mt:'10px'}} key={index}>
                        <Typography >
                          {`${collection.collectionName}, ${truncateAddress(collection.collectionAddress)}`}
                        </Typography>
                        <Typography >
                          {`${collection.collectionLTV}% LTV, ${collection.collectionAPR}% APR`}
                        </Typography>
                      </Box>
                    )
                  })
                }
              </Box> : void(0)}
              
              {key === 'expiredDate' ? value : void(0)}
              {key === 'allowExternalLP' ? (value ? 'YES': 'NO') : void(0)}
              </Box>
            </Box>
          )
        }) 
      }


      </Box>   
    )

    const loadingAfterConfirmContent = (
      <Box sx={{position:'relative',aspectRatio:'1/1',width:'100%'}}>
        <Image src={"/static/images/pepes/loading_pepe.gif"} layout="fill" objectFit="contain" alt=""/>
      </Box>
    )

    const loadingSuccessContent = (
      <Box sx={{position:'relative',aspectRatio:'1/1',width:'100%'}}>
        <Typography>Add Vault Done!</Typography>
        <Image src={"/static/images/pepes/pepe-sunglasses.gif"} layout="fill" objectFit="contain" alt=""/>
      </Box>
    )

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
          <Box 
          sx={{
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
              { activeStep == 0 && !loadingAfterConfirm && !addVaultSuccess ? 
                page0Content
              : 
                  void(0)
              }

              { activeStep == 1 && !loadingAfterConfirm && !addVaultSuccess ? 
                  page1Content
              : 
                  void(0)
              }

              { activeStep == 2 && !loadingAfterConfirm && !addVaultSuccess ? 
                  page2Content
              : 
                  void(0)
              }
              {
                loadingAfterConfirm ?
                loadingAfterConfirmContent
                :
                void(0)
              }
              {
                !loadingAfterConfirm && addVaultSuccess? 
                loadingSuccessContent
                :
                void(0)
              }
              
            </Box>
          </Box>

        </DialogContent>
        <DialogActions>
        {
          activeStep != 0 && !loadingAfterConfirm && !addVaultSuccess
          ?
          <Button onClick={()=>handleBack()}>
                Back
          </Button>
          :
          void(0)
        }

        {
          activeStep != 2 && !loadingAfterConfirm && !addVaultSuccess
          ?
          <Button onClick={()=>handleNext()}>
                Next
          </Button>
          :
          void(0)
        }
        {
          activeStep == 2 && !loadingAfterConfirm && !addVaultSuccess
          ?
          <Button onClick={()=>{finishAddVault()}}>
                Finish
          </Button>
          :
          void(0)
        }
        {
          loadingAfterConfirm || addVaultSuccess
          ?
          <Button onClick={()=>{resetEverything();setActiveStep(0);setLoadingAfterConfirm(false);setAddVaultSuccess(false);props.handleClose()}}>
                Done
          </Button>
          :
          void(0)
        }
        </DialogActions>
      </Dialog>
    )
}