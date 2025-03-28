import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppBarWithSideMenu from './Navbar';
import RouteConstants from '../../constant/Routeconstant';
import { useSnackbar } from 'notistack';
import adminQueries from '../../queries/adminQueries';
import { Layout, BookOpen, Users, UserCircle, LogOut, Home, NotebookPen } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../redux/reducers/authReducers';

function SideMenu() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar();
    const handleLogOut = () => {

        if (!window.confirm("Are you sure you want to logout?")) {
            return;
        }
        localStorage.removeItem('BooksAdminToken');
        navigate(RouteConstants.LOGIN);
        dispatch(setLogout())
        enqueueSnackbar('Logged out successfully', { variant: 'success' });
    };

    return (
        <div className="h-screen">
            <AppBarWithSideMenu />

            <div
                className="fixed top-[80px] h-[calc(100%-80px)] border-r shadow-lg"
                style={{
                    backgroundColor: '#2D82D6',
                    width: '250px',
                    zIndex: 1100
                }}
            >
                <nav className="flex flex-col h-full py-6">
                    {/* <div className="px-4 mb-6">
                        <div className="flex items-center gap-3 text-white mb-2">
                            <Layout className="w-5 h-5" />
                            <span className="font-semibold text-lg">Navigation</span>
                        </div>
                    </div> */}

                    <ul className="list-none space-y-1 px-0 flex-1">
                        <li>
                            <a
                                onClick={() => navigate(RouteConstants.DASHBOARD)}
                                className="flex items-center gap-3 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-400/30 transition-colors duration-200 no-underline"
                            >
                                <Home className="w-5 h-5" />
                                <span>Dashboard</span>
                            </a>
                        </li>

                        <li>
                            <a
                                onClick={() => navigate(RouteConstants.CREATE_MEMBERSHIP)}
                                className="flex items-center gap-3 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-400/30 transition-colors duration-200 no-underline"
                            >
                                <Users className="w-5 h-5" />
                                <span>Membership Creation</span>
                            </a>
                        </li>

                        <li className="space-y-1">
                            <a
                                onClick={() => navigate(RouteConstants.BOOKS)}
                                className="flex items-center gap-3 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-400/30 transition-colors duration-200 no-underline"
                            >
                                <BookOpen className="w-5 h-5" />
                                <span>Manage Books</span>
                            </a>
                            <ul className="pl-12 space-y-1">
                                <li>
                                    <a
                                        onClick={() => navigate(RouteConstants.BOOKCREATE)}
                                        className="flex items-center text-white/90 font-medium px-4 py-2 rounded-lg hover:bg-blue-400/30 transition-colors duration-200 text-sm no-underline"
                                    >
                                        <NotebookPen className="w-5 h-5" />
                                        <span>&nbsp;Add Book</span>
                                    </a>
                                </li>
                            </ul>
                        </li>

                        {/* <li>
                            <a
                                onClick={() => navigate(RouteConstants.ADMINPROFILE)}
                                className="flex items-center gap-3 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-400/30 transition-colors duration-200 no-underline"
                            >
                                <UserCircle className="w-5 h-5" />
                                <span>Profile</span>
                            </a>
                        </li> */}
                    </ul>

                    {/* <div className="px-3 mt-auto">
                        <button
                            onClick={handleLogOut}
                            className="flex items-center gap-3 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-400/30 transition-colors duration-200 w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Log Out</span>
                        </button>
                    </div> */}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto ml-[250px] mt-[80px] relative z-10">
                <Outlet />
            </div>
        </div>
    );
}

export default SideMenu;
