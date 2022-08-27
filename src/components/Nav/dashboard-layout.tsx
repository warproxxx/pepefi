import { useState } from 'react';
import { Box } from '@mui/material';
import { DashboardNavbar } from './dashboard-navbar'
import { DashboardSidebar } from './dashboard-sidebar'
import {styled, experimental_sx as sx} from '@mui/system';

import { MyLoansPopUp } from 'src/components/MyLoans/MyLoansPopUp';

const DashboardLayoutRoot = styled('div')((props) => sx({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: '64px',
}));

export const DashboardLayout = (props:any) => {
  const { children } = props;

  const [myLoansPopUpOpen, setMyLoansPopUpOpen] = useState(false);

  const handleMyLoansPopUpOpen = () => {
    setMyLoansPopUpOpen(true);
  };

  const handleMyLoansPopUpClose = () => {
    setMyLoansPopUpOpen(false);
  };

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
      <DashboardNavbar handleMyLoansPopUpOpen={handleMyLoansPopUpOpen}/>
      {/* <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen}/> */}
      <MyLoansPopUp open={myLoansPopUpOpen} handleClose={handleMyLoansPopUpClose}/>
    </>
  );
};