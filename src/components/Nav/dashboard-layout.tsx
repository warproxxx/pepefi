import { useState } from 'react';
import { Box } from '@mui/material';
import { DashboardNavbar } from './dashboard-navbar'
import { DashboardSidebar } from './dashboard-sidebar'
import {styled, experimental_sx as sx} from '@mui/system';

const DashboardLayoutRoot = styled('div')((props) => sx({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: '64px',
}));

export const DashboardLayout = (props:any) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      {/* <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen}/> */}
    </>
  );
};