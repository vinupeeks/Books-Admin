import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Spinner from '../../utils/Spinner';
import { jwtDecode } from 'jwt-decode';
import RouteConstants from '../../constant/Routeconstant';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('BooksAdminToken');
                const decodedToken = jwtDecode(token);
                const id = decodedToken.id;

                if (!token) {
                    enqueueSnackbar('No token found, redirecting to login...', { variant: 'warning' });
                    navigate(RouteConstants.LOGIN);
                    return;
                }

                const response = await axios.get(`http://localhost:1000/admin/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('BooksAdminToken');
        navigate(RouteConstants.LOGIN);
        enqueueSnackbar('Admin Logged-Out Successfully', { variant: 'success' });
    };

    if (loading) {
        return (
            <Spinner />
        );
    }

    return (
        <div>
            <br />
            <div className="min-h-screen bg-gray-100 flex  justify-center ">
                <div className="bg-white p-10 rounded-lg shadow-lg   w-[700px] mx-auto h-[400px]">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Profile</h2>
                    {user ? (
                        <div className="space-y-6 px-5">
                            <hr className="my-2" />
                            <div className="flex justify-between items-center px-4">
                                <span className="text-lg text-gray-600">Username:</span>
                                <span className="font-medium text-gray-800">{user.username}</span>
                            </div>

                            <div className="flex justify-between items-center px-4">
                                <span className="text-lg text-gray-600">Email:</span>
                                <span className="font-medium text-gray-800">{user.email}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">No user data found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
