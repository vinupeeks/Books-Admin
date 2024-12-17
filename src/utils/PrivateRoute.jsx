import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getAuthToken } from './TokenHelper';
import RouteConstants from '../constant/Routeconstant';
import { useSnackbar } from 'notistack';

const PrivateRoute = ({ element }) => {
    const { enqueueSnackbar } = useSnackbar();

    const token = getAuthToken();
    let isAdmin = false;
    let isTokenExpired = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);

            isAdmin = decodedToken.role;
            const currentTime = Math.floor(Date.now() / 1000);
            isTokenExpired = decodedToken.exp < currentTime;


            if (isTokenExpired || !token) {
                localStorage.removeItem('BooksAdminToken');
                <Navigate to={RouteConstants.LOGIN} />;
                enqueueSnackbar('Section timedout please login again..!', { variant: 'warning' });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }

        } catch (error) {
            console.error('Error decoding token', error);
        }
    }


    return isAdmin === 'admin' ? element : <Navigate to={RouteConstants.LOGIN} />;
};

export default PrivateRoute;
