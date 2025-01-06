import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constant/Routeconstant';
import adminQueries from '../../queries/adminQueries.jsx';
import logo from '../../assets/images/Logo.jpg';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../redux/reducers/authReducers.js';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch()

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const submitForm = adminQueries.adminLoginMutation(
        async (response) => {
            if (response?.data?.token) {
                const token = response.data.token;
                localStorage.setItem('BooksAdminToken', token);
                dispatch(setLogin(token));
                enqueueSnackbar('Login successful', { variant: 'success' });
                navigate(RouteConstants.DASHBOARD);
            } else {
                enqueueSnackbar('Invalid email or password', { variant: 'error' });
            }
            setIsLoading(false);
        },
        {
            onError: (error) => {
                enqueueSnackbar(error.response?.data?.message || 'Login failed', { variant: 'error' });
                setIsLoading(false);
            },
        }
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        submitForm.mutateAsync(formData).catch(() => setIsLoading(false));
    };

    useEffect(() => {
        const token = localStorage.getItem('BooksAdminToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    navigate(RouteConstants.ROOT);
                }
            } catch {
                localStorage.removeItem('BooksAdminToken');
            }
        }
    }, [navigate]);

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
                    <img src={logo} alt="Skyline Logo" style={{ width: '100%', maxWidth: '350px' }} />
                </Box>

                <Box sx={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            mb: 4,
                            textAlign: 'center',
                            background: 'linear-gradient(90deg, #e78e20, #631519)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                        component="div"
                    >
                        {/* <h2>Skyline IVY-League</h2> */}
                        <h1>Library Application</h1>
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="email"
                            placeholder="Email"
                            variant="outlined"
                            required
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
                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            variant="outlined"
                            required
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
                                        <IconButton onClick={handleClickShowPassword} aria-label={showPassword ? "Hide password" : "Show password"}>
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2, backgroundColor: '#F6F6F9', borderRadius: '5px' }}
                        /><Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                // justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    mb: 2,
                                    fontWeight: 'bold',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    width: '35%',
                                    background: 'linear-gradient(45deg, #e78e20, #631519)',
                                    transition: 'background 0.5s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #631519, #e78e20)',
                                    },
                                }}
                            >
                                {isLoading ? 'Logging...' : 'LOGIN'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLogin;
