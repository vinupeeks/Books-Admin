import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constant/Routeconstant';
import adminQueries from '../../queries/adminQueries.jsx';
import logo from '../../assets/images/skyline-logo.png';
import { jwtDecode } from 'jwt-decode';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const submitForm = adminQueries.adminLoginMutation(
        async (response) => {
            console.log(`Login Response: `, response);

            if (response.data.token) {
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
                enqueueSnackbar(error.response.data.message, { variant: 'error' });
                setError('Failed to fetch Books list. Please try again later.');
                setIsLoading(false);
            }
        }
    );

    const handleSubmit = (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const datavalues = {
                email,
                password
            };
            submitForm.mutateAsync(datavalues);
        } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("BooksAdminToken");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const isTokenExpired = decoded.exp * 1000 < Date.now();

                if (!isTokenExpired) {
                    navigate(RouteConstants.DASHBOARD);
                }
            } catch (error) {
                console.error("Invalid token");
            }
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="flex items-center bg-white shadow-xl rounded-lg p-12 space-x-16">
                <div className="hidden md:block">
                    <img src={logo} alt="Skyline Logo" className="w-64 h-auto" />
                </div>
                <div className="w-full max-w-md">
                    <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">WELCOME BACK</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-2 block w-full px-4 py-3 text-lg border border-gray-400 rounded-md shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-2 block w-full px-4 py-3 text-lg border border-gray-400 rounded-md shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold text-xl rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
