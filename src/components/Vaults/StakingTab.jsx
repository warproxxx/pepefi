import { useEffect, useState,useMemo } from "react";
import {
  Button,
  Box,
  TextField,
  Typography,
  CardContent,
  Card,
  InputAdornment,
  Input
} from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { addLiquidity, removeLiquidity } from "@utils/web3Provider";

  const useStyle = makeStyles({
    root: {
      marginTop: "1rem",
    },
    stakingHeader: {
      textAlign: "center",
      fontSize: "30px",
      color: "#5048E5",
      display: 'flex'
    },
    stakingText: {
      marginBottom: "1rem",
      textAlign: "center",
      display: 'flex'
    },
  });

export const StakingTab = (props) => {
    const styles = useStyle();
    let withdrawableValue = props.withdrawableValue;
    const [depositAmountInput, setDepositAmountInput] = useState("");
    const [withdrawAmountInput, setWithdrawAmountInput] = useState("");
    const [withdrawable,setWithdrawable] = useState(true);

    const handleDepositAmountInput = (event, value) => {
      setDepositAmountInput(value);
    }

    const handleWidthdrawAmountInput = (event,value) => {
      setWithdrawAmountInput(value);
    }

    const stringToNum = (txt) => {
        if(txt.split){
          let number = txt.split(" ")[0];
          return Number(number)
        }
        else{
          return 0;
        }
      }
    
      let depositAmountInputNumber = Number(depositAmountInput);
      let withdrawableValueNumber = stringToNum(withdrawableValue);
      if(withdrawable){
        if(depositAmountInputNumber > withdrawableValueNumber){
          setWithdrawable(false);
        }
      }
      else{
        if(depositAmountInputNumber <= withdrawableValueNumber){
          setWithdrawable(true);
        }
      }

    const inputAdornmentForDAI = () => {
      return(
        <InputAdornment position="end" sx={{"& p": {
          color: "#f0ad39"
        }}}>DAI</InputAdornment>
      )
    }

    const inputAdornmentForShares = () => {
      return(
        <InputAdornment position="end" sx={{"& p": {
          color: "#1890ff"
        }}}>shares</InputAdornment>
      )
    }

    // const withdrawInputAdornmentForShares = () => {
    //   return(
    //     <InputAdornment position="end" sx={{
    //       color: "#1890ff"
    //     }}>/{500} shares</InputAdornment>
    //   )
    // }

    // const withdrawInputAdornmentForDAI = () => {
    //   return(
    //     <InputAdornment position="end" sx={{
    //       color: "#f0ad39"
    //     }}>/{500} DAI</InputAdornment>
    //   )
    // }


    return (
      <>
        <Box>
          <Box>
            <Card>
              <CardContent>
                <Box sx={{display:'flex',"justifyContent":"space-between","alignContent":"center","alignItems":"center"}}>
                <TextField
                      label={"Enter stake amount"}
                      variant="outlined"
                      InputProps={{
                      endAdornment: props.switchState ? inputAdornmentForDAI() : inputAdornmentForShares(),
                      inputMode: 'numeric', 
                      pattern: '[0-9]*' ,
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={depositAmountInput}
                      onChange={(event,value)=>{handleDepositAmountInput(event,value)}}
                      sx={{
                          width:'80%'
                      }}
                  />
                    <Button
                      variant="contained"
                      onClick={() => {addLiquidity(depositAmountInput);}}
                      sx={{
                        height:"50px",
                        width:"18%"
                      }}
                    >
                      Stake
                    </Button>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{mt:'20px'}}>
              <CardContent>
                <Box sx={{display:'flex',"justifyContent":"space-between","alignContent":"center","alignItems":"center"}}>
                <TextField
                      label={"Enter withdraw amount"}
                      variant="outlined"
                      InputProps={{
                      endAdornment: props.switchState ? inputAdornmentForDAI() : inputAdornmentForShares(),
                      inputMode: 'numeric', 
                      pattern: '[0-9]*' 
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={withdrawAmountInput}
                      onChange={(event,value)=>{handleWidthdrawAmountInput(event,value)}}
                      sx={{
                          width:'80%'
                      }}
                      placeholder={"5000 MAX"}
                  />
                    <Button
                      variant="contained"
                      onClick={() => {removeLiquidity(withdrawAmountInput);}}
                      sx={{
                        height:"50px",
                        width:"18%"
                      }}
                    >
                      Withdrawl
                    </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </>
    )
}