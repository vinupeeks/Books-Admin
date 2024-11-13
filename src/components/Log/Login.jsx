import React, { useState } from 'react'; 
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constant/Routeconstant';
import adminQueries from '../../queries/adminQueries.jsx'; 

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const submitForm = adminQueries.adminLoginMutation(
        async (response) => {
            console.log(`Loging Response: `, response);

            if (response.data.token) {
                const token = response.data.token;
                localStorage.setItem('BooksAdminToken', token);
                enqueueSnackbar('Login successful', { variant: 'success' });
                navigate(RouteConstants.ROOT);
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
