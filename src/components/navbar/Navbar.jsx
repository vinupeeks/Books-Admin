import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { jwtDecode } from 'jwt-decode';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useViewContext } from '../../ViewContext';
import RouteConstants from '../../constant/Routeconstant';

export default function AppBarWithSideMenu() {

    const { setViewFormat } = useViewContext();

    const { enqueueSnackbar } = useSnackbar();
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [name, setName] = useState('');
    const [sideMenu, setSideMenu] = useState(false);
    const [role, setRole] = useState('');
    const [show, setShow] = useState(false);
    const [showType, setShowType] = useState('table')
    const navigate = useNavigate();

    const handleClose = (e) => {
        
        if (e && !e.altKey) {
            console.log(e);
            e = null;
        }
        if (e) {
            navigate(`/${e}`);
        }
        setShow(false);
        // console.log(e);
        setAnchorEl(null);
    };


    const handleViewChange = (format) => {
        setViewFormat(format);
        setSideMenu((prev) => !prev);
        // navigate('/home'); 
    };

    const handleLogOut = () => {
        localStorage.removeItem('BooksAdminToken');
        navigate(RouteConstants.LOGIN);
        enqueueSnackbar('Admin Logged-Out Successfully', { variant: 'success' });
        setShow(false);
    }
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuIconClick = () => {
        setShow(true);
        setSideMenu((prev) => !prev);
    };

    const handleMenuClick = (menuName) => {
        if (role === 'admin') {
        }
        handleClose();
    };

    useEffect(() => {
        const Token = localStorage.getItem('BooksAdminToken');
        if (Token) {
            try {
                const decodedToken = jwtDecode(Token);
                setName(decodedToken.role);
                setRole(decodedToken.role);
            } catch (error) {
                console.error('Token decoding failed:', error);
            }
        }
    }, []);

    return (
        <Box sx={{ flexGrow: 2 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleMenuIconClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => { navigate(`/`) }}>
                        Books-Library
                    </Typography>
                    {auth && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <span
                                    style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '8px' }}
                                >
                                    {name ? name : 'Guest'}
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
                                <MenuItem onClick={() => { handleClose('admin/profile') }}>Profile</MenuItem>
                                <MenuItem onClick={() => { handleClose('account') }}>My account</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>

            <>
                <Offcanvas show={show} onHide={handleClose} placement="start" className="w-64 bg-blue-100">
                    <Offcanvas.Header closeButton style={{ backgroundColor: '#1976D2' }}>
                        <Offcanvas.Title className="text-white">Books-Store</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <nav className="pt-5">
                            <ul className="list-none p-0">
                                <li className="mb-3">
                                    <a
                                        href="/"
                                        onClick={() => handleMenuClick('Home')}
                                        className="text-black font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                    >
                                        Home
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a
                                        href="/books/create"
                                        onClick={() => handleMenuClick('Add Product')}
                                        className="text-black font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                    >
                                        Add Product
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a
                                        href="/cart"
                                        onClick={() => handleMenuClick('Cart')}
                                        className="text-black font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                    >
                                        Cart
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a
                                        className="text-black font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                    >
                                        Section-Wise
                                    </a>

                                    <ul className="pl-4 mt-2">
                                        <li>
                                            <a
                                                className="text-black font-normal block px-4 py-2 rounded hover:bg-gray-200 transition no-underline"
                                                onClick={() => handleViewChange('table')}
                                            >
                                                Table
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="text-black font-normal block px-4 py-2 rounded hover:bg-gray-200 transition no-underline"
                                                onClick={() => handleViewChange('card')}
                                            >
                                                Card
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                {/* <li className="mb-3">
                                    <a
                                        href="/admin/profile"
                                        onClick={() => handleMenuClick()}
                                        className="text-black font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                    >
                                        Profile
                                    </a>
                                </li> */}
                                <li className="mb-3">
                                    <a
                                        href="/admin/users"
                                        onClick={() => handleMenuClick()}
                                        className="text-black font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                    >
                                        Users-List
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a
                                        href="/contact"
                                        onClick={() => handleMenuClick('Contact Us')}
                                        className="text-black font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <div
                                        onClick={() => {
                                            handleLogOut();
                                        }}
                                        className="text-black font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                    >
                                        Log-Out
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </Offcanvas.Body>
                </Offcanvas>
            </>
            {/* <br /> */}
        </Box >
    );
}