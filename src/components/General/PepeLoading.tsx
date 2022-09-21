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
  DialogAction
} from "@mui/material";

import { styled, experimental_sx as sx } from '@mui/system';
import Image from "next/image";

import { useAppDispatch,useAppSelector } from "src/app/hooks";
import { selectLoading, closeModal } from "src/redux/loadingSlice";


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PepeLoading = (props:any) => {
  const dispatch = useAppDispatch();
  const loadingState = useAppSelector(selectLoading);

    return (
        <Dialog
        open={loadingState.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>{}}
        PaperProps={{
          sx:{
            minWidth:'700px',
            background: "#18181833",
            boxShadow: "3px 11px 3px rgba(0, 0, 0, 0.25)",
            backdropFilter:"blur(30px)",
            borderRadius: "20px",
            alignItems: "center",
            fontFamily:'DM Mono',
            minHeight:'550px',
            py:'20px',
          }
        }}
        >
          {
            loadingState.loading ?
            <>
            <DialogTitle variant="h5">{loadingState.title}</DialogTitle>
            <DialogContent sx={{width:'100%',padding:'20px',background:'transparent',width:'25vw',aspectRatio:'1/1',position:'relative'}}>
            <Image src={"/static/images/pepes/loading_pepe.gif"} layout="fill" objectFit="contain" alt=""/>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{
                  dispatch(
                    closeModal()
                  )
                  }}>Close</Button>
              </DialogActions>
            </>

            :
            loadingState.success ?
            <>
            <DialogTitle variant="h5">{`Success`}</DialogTitle>
            <DialogContent sx={{width:'100%',padding:'20px',background:'transparent',width:'40vw',aspectRatio:'2/1',position:'relative'}}>
            <Image src={"/static/images/pepes/pepe-sunglasses.gif"} layout="fill" objectFit="contain" alt=""/>
            </DialogContent>  
            <DialogActions>
                <Button onClick={()=>{
                  dispatch(
                    closeModal()
                  )
                  }}>Close</Button>
              </DialogActions>
            </>

            :
            <>
            <DialogTitle variant="h5">{`Fail`}</DialogTitle>
              <DialogContent sx={{width:'100%',padding:'20px',background:'transparent',width:'20vw',aspectRatio:'1/1',position:'relative'}}>
              <Image src={"/static/images/pepes/crying.gif"} layout="fill" objectFit="contain" alt=""/>
              </DialogContent>     
              <DialogActions>
                <Button onClick={()=>{
                  dispatch(
                    closeModal()
                  )
                  }}>Close</Button>
              </DialogActions>
            </>

          }
        </Dialog>

    )
}