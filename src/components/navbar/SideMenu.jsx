import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppBarWithSideMenu from './Navbar';
import RouteConstants from '../../constant/Routeconstant';
import { useSnackbar } from 'notistack';
import adminQueries from '../../queries/adminQueries';

function SideMenu() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const handleLogOut = () => {

        if (!window.confirm("Are you sure you want to logout?")) {
            return;
        }
        localStorage.removeItem('BooksAdminToken');
        navigate(RouteConstants.LOGIN);
        enqueueSnackbar('Logged out successfully', { variant: 'success' });
    };

    return (
        <div className="h-screen">
            <AppBarWithSideMenu />

            <div
                className="fixed h-full border shadow-md"
                style={{ backgroundColor: '#2D82D6', width: '300px' }}
            >
                <nav className="mt-3 w-[300px]">
                    <ul className="list-none space-y-3">
                        <li>
                            <a
                                // href={RouteConstants.DASHBOARD}
                                onClick={() => navigate(RouteConstants.DASHBOARD)}
                                className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                            >
                                Dashboard
                            </a>
                        </li>

                        <li>
                            <a
                                // href={RouteConstants.FAMILY_MEMBERSHIP}
                                onClick={() => navigate(RouteConstants.FAMILY_MEMBERSHIP)}
                                className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                            >
                                Membership Creation
                            </a>
                        </li>

                        <li>
                            <div>
                                <a
                                    // href={RouteConstants.ROOT}
                                    onClick={() => navigate(RouteConstants.ROOT)}
                                    className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                >
                                    Manage Books
                                </a>
                                <ul className="pl-6 mt-2 space-y-2">
                                    <li>
                                        <a
                                            // href={RouteConstants.BOOKCREATE}
                                            onClick={() => navigate(RouteConstants.BOOKCREATE)}
                                            className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                        >
                                            Add Product
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>


                        {/* <li>
                            <div>
                                <a
                                    // href={RouteConstants.ROOT}
                                    onClick={() => navigate(RouteConstants.DASHBOARD)}
                                    className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                >
                                    Members List
                                </a>
                                <ul className="pl-6 mt-2 space-y-2">
                                    <li>
                                        <a
                                            // href={RouteConstants.BOOKCREATE}
                                            // onClick={() => navigate(RouteConstants.BOOKCREATE)}
                                            className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                        >
                                            All
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            // href={RouteConstants.BOOKCREATE}
                                            // onClick={() => navigate(RouteConstants.BOOKCREATE)}
                                            className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                        >
                                            Individual
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            // href={RouteConstants.BOOKCREATE}
                                            // onClick={() => navigate(RouteConstants.BOOKCREATE)}
                                            className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                                        >
                                            Family
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li> */}
                        <li>
                            <a
                                // href={RouteConstants.ADMINPROFILE}
                                onClick={() => navigate(RouteConstants.ADMINPROFILE)}
                                className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline"
                            >
                                Profile
                            </a>
                        </li>

                        <li>
                            <div
                                onClick={handleLogOut}
                                className="text-white font-semibold block px-4 py-2 rounded hover:bg-blue-300 transition no-underline cursor-pointer"
                            >
                                Log Out
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>


            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto ml-[300px] mt-[80px]">
                <Outlet />
            </div>
        </div>
    );
}

export default SideMenu;
