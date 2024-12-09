import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constant/Routeconstant';
import adminQueries from '../../queries/adminQueries.jsx';
// import logo from '../../assets/images/skyline-logo.png';
import logo from '../../assets/images/Logo.jpg';
import { jwtDecode } from 'jwt-decode';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const submitForm = adminQueries.adminLoginMutation(
        async (response) => {
            if (response?.data?.token) {
                const token = response.data.token;
                localStorage.setItem('BooksAdminToken', token);
                enqueueSnackbar('Login successful', { variant: 'success' });
                navigate(RouteConstants.DASHBOARD);
                window.location.reload();
            } else {
                enqueueSnackbar('Invalid email or password', { variant: 'error' });
            }
            setIsLoading(false);
        },
        {
            onError: (error) => {
                enqueueSnackbar(error.response.data.message || 'Login failed', { variant: 'error' });
                setIsLoading(false);
            },
        }
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const { email, password } = formData;
            submitForm.mutateAsync({ email, password });
        } catch (error) {
            enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('BooksAdminToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    navigate(RouteConstants.DASHBOARD);
                }
            } catch (error) {
                console.error('Invalid token');
            }
        }
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f6fa',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    width: { xs: '100%', md: '50%' },
                    height: '50vh',
                    boxShadow: 3,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                }}
            >
                {/* Left Section with Logo */}
                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: '#ffffff',
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                    }}
                >
                    <img
                        src={logo}
                        alt="Skyline Logo"
                        style={{ width: '100%', maxWidth: '350px' }}
                    />
                </Box>

                {/* Right Section with Form */}
                <Box sx={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                         Welcome Back
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <TextField
                            fullWidth
                            name="email"
                            placeholder="Email"
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2, backgroundColor: '#F6F6F9', borderRadius: '5px' }}
                        />

                        {/* Password Input */}
                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword}>
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2, backgroundColor: '#F6F6F9', borderRadius: '5px' }}
                        />

                        {/* Login Button */}
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                mb: 2,
                                backgroundColor: '#6C63FF',
                                fontWeight: 'bold',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '5px',
                                '&:hover': {
                                    backgroundColor: '#5a53e2',
                                },
                            }}
                        >
                            {isLoading ? 'Logging in...' : 'LOGIN'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLogin;
