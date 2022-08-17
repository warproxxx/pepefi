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
  Slide 
} from "@mui/material";
import Staking from "src/components/Vaults/Staking";


const steps = [
    'Gerneral Info',
    'Vault Details',
    'Confirmation',
  ];
  
  const inputs = [
    "Vault Name",
    "Provider Address",
    "Fund Size",
    "Risk Tolerance",
    "Vigorish"
  ]

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export const VaultDetailsPopup = (props) => {
    
    return (
        <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClose}
        PaperProps={{
          style:{
            minWidth:'1000px'
          }
        }}
        
      >
        <DialogContent>
        <Staking vaultName={props.vaultName}/>
        </DialogContent>
      </Dialog>
    )
}