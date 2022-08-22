import PropTypes from 'prop-types';
import { AppBar, Avatar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image'
import useScrollListener from "src/hooks/useScrollListener";
import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-scroll';
import { useRouter } from 'next/router';

import {web3ModalHelper} from '../../utils/web3ModalFunctions'
import {truncateAddress,toHex} from '../../utils/helpers'
import { useAppSelector } from '../../app/hooks';
import {selectWallets,} from '../../redux/walletsSlice';

const pages = [ 'Loans','Vaults'];
const links = ["/loans",'/vaults'];
const keywords = ['loan','vault'];
export const DashboardNavbar = (props:any) => {
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [navClassList, setNavClassList] = useState([]);

  const open = Boolean(anchorElUser);

  const scroll = useScrollListener();

  // useEffect(() => {
  //   const _classList = [];

  //   if (scroll.y > 200 && scroll.y - scroll.lastY > 0)
  //     _classList.push("nav-bar--hidden");

  //   setNavClassList(_classList);
  // }, [scroll.y, scroll.lastY]);

  const handleOpenNavMenu = (event:any) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event:any) => {
    setAnchorElUser(event.currentTarget);
  };
  

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  let connectWallet = web3ModalHelper.connectWallet;
  let disconnect = web3ModalHelper.disconnect;
  const wallets = useAppSelector(selectWallets);



  return (
    <AppBar position="fixed" className={navClassList.join(" ")} sx={{boxShadow:"none",transition: "transform 250ms ease-in-out",backgroundColor:'black'}} >
      <Container maxWidth="lg" sx={{width:{xs:'100%'},maxWidth:'1400px !important'}}>
        <Toolbar disableGutters>
        <Box 
        onClick={()=>{router.push('/')}}
        sx={{
          cursor:'pointer',
          display: { xs: 'none', md: 'flex' },
          alignItems:'center'
        }}>
        <Image src="/static/logo.png" height={70} width={70}/>
        <Typography sx={{
          fontSize:'25px',
          marginLeft:'20px'
        }}>
          PepeFi
        </Typography>
        </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page,index) => (
                <MenuItem key={page}>
                    {page}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{
            cursor:'pointer',
            display: { xs: 'flex', md: 'none' }, 
            flexGrow: "1"
          }}>
          {/* <Image src="/static/logo.svg" height={100} width={150}/> */}
          <Typography sx={{
            fontSize:'25px'
          }}>
            PepeFi
          </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } , justifyContent: "flex-start", marginLeft:'50px'}}>
            {pages.map((page,index) => (
                <Button 
                  onClick={()=>{router.push(links[index])}}
                  key={page}
                  sx={{ my: 2, display: 'block',fontSize:"var(--nav-bar-fontSize)", fontFamily: "var(--main-font)", color: `${router.asPath.includes(keywords[index]) ? "#6aed6f" : "white"}`}}
                >
                  {page}
                </Button>
            ))}
          </Box>
          {wallets.account ? 
          <>
            <Box>
             <Button variant="contained" onClick={(event)=>{handleOpenUserMenu(event)}} sx={{}}>
              {`${truncateAddress(wallets.account)}`}
            </Button>
            <Menu
            id="basic-menu"
            anchorEl={anchorElUser}
            open={open}
            onClose={handleCloseUserMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "white"
              }
            }}
          >
            <MenuItem onClick={()=>{disconnect();handleCloseUserMenu();}}>Disconnect</MenuItem>
          </Menu>  
            </Box>
       
          </>
          :
          <Box onClick={()=>{connectWallet()}} sx={{
            cursor:'pointer',
            transitionDuration:'0.5s',
            "&:hover":{
              transform:'translateY(10px)',
            }
            }}>
            <img src="/static/images/pepes/wallet.png" height="70px" width='80px'/>
          </Box>
          }

        </Toolbar>
      </Container>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
