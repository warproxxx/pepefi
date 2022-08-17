import { useEffect, useState,useMemo } from "react";
import {
  Box,
  Typography,
  Switch
} from "@mui/material";
import { styled } from "@mui/styles";
import { StakingDataCard } from "src/components/Bookie/StakingDataCard";


export const GeneralTab = (props) => {
  let liqDisplayValue = props.liqDisplayValue;
  let balanceHoldValue = props.balanceHoldValue;
  let withdrawableValue = props.withdrawableValue;
  let userStakeValue = props.userStakeValue;
  const [switchState, setSwitchState] = useState(true);

  return (
    <Box
        sx={{
        display: "flex",
        flexDirection: "column",
        flexBasis: "60%",
        gap: "0.5rem",
        }}
    >

        <StakingDataCard
            key="totalBookiePool"
            title="Total Bookie Liquidity"
            description="The totatl liquditiy in the vault"
            unit={`${props.switchState ? 'DAI' : 'shares'}`}
            data={liqDisplayValue}
        />
        <StakingDataCard
            key="userStake"
            title="My Current Stake"
            description="The shares or DAI you current have in this vault"
            unit={`${props.switchState  ? 'DAI' : 'shares'}`}
            data={userStakeValue}
        />
        <StakingDataCard
            key="userBalanceHeld"
            title="Balance on Hold"
            description="The shares or DAI that is currently locked for you in this vault"
            unit={`${props.switchState  ? 'DAI' : 'shares'}`}
            data={balanceHoldValue}
        />
        <StakingDataCard
            key="amtToStake"
            title="Withdrawable"
            description="The shares or DAI that is withdrawlable for you in this vault"
            unit={`${props.switchState  ? 'DAI' : 'shares'}`}
            data={withdrawableValue}
        /> 
    </Box>
  );
};
