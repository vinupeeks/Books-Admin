import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Spinner from '../../utils/Spinner';
import RouteConstants from '../../constant/Routeconstant';
import adminQueries from '../../queries/adminQueries';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../redux/reducers/authReducers';

const ProfilePage = () => {
    const dispatch = useDispatch()

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setLoading(true);
        getProfileDetails.mutate();
    }
    const getProfileDetails = adminQueries.adminProfileMutation(
        async (response) => { 
            setUser(response?.data);
            setLoading(false);
        },
        {
            onError: (error) => {
                setError("Error fetching membership data");
                setLoading(false);
            }
        }
    );

    // const handleLogout = () => {
    //     localStorage.removeItem('BooksAdminToken');
    //     navigate(RouteConstants.LOGIN);
    //     window.location.reload();
    //     enqueueSnackbar('Admin Logged-Out Successfully', { variant: 'success' });
    // };

    const handleLogout = () => {

        if (!window.confirm("Are you sure you want to logout?")) {
            return;
        }
        localStorage.removeItem('BooksAdminToken');
        navigate(RouteConstants.LOGIN);
        dispatch(setLogout())
        enqueueSnackbar('Logged out successfully', { variant: 'success' });
    }

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
                                <span className="font-medium text-gray-800">{user?.username}</span>
                            </div>

                            <div className="flex justify-between items-center px-4">
                                <span className="text-lg text-gray-600">Email:</span>
                                <span className="font-medium text-gray-800">{user?.email}</span>
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
                        <p className="text-center text-gray-600">No Admin data found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
