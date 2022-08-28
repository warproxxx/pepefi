import { useState, useEffect} from 'react';
import { Box } from '@mui/material';
import { DashboardNavbar } from './dashboard-navbar'
import {styled, experimental_sx as sx} from '@mui/system';

import {
  setAccount,
  setChainId,
} from 'src/redux/walletsSlice';
import {web3ModalSetup} from 'src/utils/web3ModalFunctions'
import { connectWalletAndGetData, disconnectAndClearData, getAndSetVaults, getAndSetAssets, getAndSetMyLoans } from 'src/utils/reduxSlicesConnector';

import { MyLoansPopUp } from 'src/components/MyLoans/MyLoansPopUp';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { selectWallets } from 'src/redux/walletsSlice';

import { useTraceUpdate } from 'src/hooks/useTraceUpdate';

const DashboardLayoutRoot = styled('div')((props) => sx({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: '64px',
}));

export const DashboardLayout = (props:any) => {
  useTraceUpdate(props);
  const { children } = props;

  const [myLoansPopUpOpen, setMyLoansPopUpOpen] = useState(false);

  const handleMyLoansPopUpOpen = () => {
    setMyLoansPopUpOpen(true);
  };

  const handleMyLoansPopUpClose = () => {
    setMyLoansPopUpOpen(false);
  };

  const wallets = useAppSelector(selectWallets);
  const dispatch = useAppDispatch(); 


  useEffect(() => {
    async function LoginAndGetVaultts() {
      let web3Modal = web3ModalSetup();
      let connectSuccess = false;
      if (web3Modal.cachedProvider) {
        connectSuccess = await connectWalletAndGetData();
      }
      if(connectSuccess)
      {
        getAndSetVaults();
        getAndSetAssets();
        getAndSetMyLoans();
      }
    }
    LoginAndGetVaultts();
  }, []); 

  useEffect(() => {
  if (wallets.provider?.on) {
      const handleAccountsChanged:Function = (accounts:Array<string>) => {
      console.log("accountsChanged", accounts);
      if (accounts) dispatch(setAccount(accounts[0]));
      };

      const handleChainChanged:Function = (_hexChainId:number) => {
          dispatch(setChainId(_hexChainId));
      };

      const handleDisconnect:Function = () => {
      console.log("disconnect", wallets.error);
      disconnectAndClearData();
      };

      wallets.provider.on("accountsChanged", handleAccountsChanged);
      wallets.provider.on("chainChanged", handleChainChanged);
      wallets.provider.on("disconnect", handleDisconnect);

      return () => {
      if (wallets.provider.removeListener) {
          wallets.provider.removeListener("accountsChanged", handleAccountsChanged);
          wallets.provider.removeListener("chainChanged", handleChainChanged);
          wallets.provider.removeListener("disconnect", handleDisconnect);
      }
      };
  }
  }, [wallets.provider]);

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            padding:'0px'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      {/* @ts-ignore*/}
      <DashboardNavbar handleMyLoansPopUpOpen={handleMyLoansPopUpOpen}/>
      {/* <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen}/> */}
      <MyLoansPopUp open={myLoansPopUpOpen} handleClose={handleMyLoansPopUpClose}/>
    </>
  );
};