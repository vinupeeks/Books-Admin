import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu'; 
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useViewContext } from '../../context/ViewContext';
import RouteConstants from '../../constant/Routeconstant';
import { getDecodedToken } from '../../utils/TokenHelper';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../redux/reducers/authReducers';

export default function AppBarWithSideMenu() {
    const { setViewFormat } = useViewContext();
    const { enqueueSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = useState(null);
    const [name, setName] = useState('Guest');
    const [role, setRole] = useState('');
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        localStorage.removeItem('BooksAdminToken');
        if (!window.confirm("Are you sure you want to logout?")) {
            return;
        }
        localStorage.removeItem('BooksAdminToken');
        navigate(RouteConstants.LOGIN);
        dispatch(setLogout())
        enqueueSnackbar('Logged out successfully', { variant: 'success' });
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        // const Token = localStorage.getItem('BooksAdminToken');
        const Token = getDecodedToken();
        if (Token) {
            try {
                setName(Token.name);
                setRole(Token.role);
            } catch (error) {
                enqueueSnackbar('Session expired. Please log in again.', { variant: 'error' });
                handleLogOut();
            }
        }
    }, [enqueueSnackbar, navigate]);

    return (
        <Box sx={{ flexGrow: 1, marginTop: '80px' }}>
            <AppBar position="fixed" sx={{ height: 80 }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={() => navigate(RouteConstants.DASHBOARD)}
                    >
                        Skyline IVY-League Library Application
                    </Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '8px' }}>
                            {name}
                        </span>
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => navigate(RouteConstants.ADMINPROFILE)}>Profile</MenuItem>
                        <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
