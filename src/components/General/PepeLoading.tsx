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
import Image from "next/image";



const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PepeLoading = (props:any) => {
  let loading = false;
  let success = false;
    return (
        <Dialog
        open={loading}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>{}}
        PaperProps={{
          sx:{
            background: "transparent",
            boxShadow: "3px 11px 3px rgba(0, 0, 0, 0.25)",
            backdropFilter:"blur(30px)",
            borderRadius: "20px",
            alignItems: "center",
            fontFamily:'DM Mono',
            overflow:'hidden'
          }
        }}
        >
          {
            loading ? 
            <>
            <DialogContent sx={{width:'100%',padding:'20px',background:'transparent',width:'25vw',aspectRatio:'1/1',position:'relative'}}>
            <Image src={"/static/images/pepes/loading_pepe.gif"} layout="fill" objectFit="contain" alt=""/>
            </DialogContent>
            </>

            :
            success ?
            <>
             <Typography variant="h3" sx={{}}>Success</Typography>
            <DialogContent sx={{width:'100%',padding:'20px',background:'transparent',width:'25vw',aspectRatio:'1/1',position:'relative'}}>
            <Image src={"/static/images/pepes/pepe-sunglasses.gif"} layout="fill" objectFit="contain" alt=""/>
            </DialogContent>           
            </>

            :
            <>
              <Typography variant="h3" sx={{}}>Failed</Typography>
              <DialogContent sx={{width:'100%',padding:'20px',background:'transparent',width:'25vw',aspectRatio:'1/1',position:'relative'}}>
              <Image src={"/static/images/pepes/crying.gif"} layout="fill" objectFit="contain" alt=""/>
              </DialogContent>           
            </>

          }

        </Dialog>

    )
}