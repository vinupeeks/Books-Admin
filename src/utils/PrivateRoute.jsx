import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getAuthToken } from './TokenHelper';
import RouteConstants from '../constant/Routeconstant';

const PrivateRoute = ({ element }) => {
    const token = getAuthToken();
    let isAdmin = false;
    let isTokenExpired = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            isTokenExpired = decodedToken.exp < currentTime;

            if (!isTokenExpired) {
                isAdmin = decodedToken.role === 'admin';
            }
        } catch (error) {
            console.error('Error decoding token', error);
        }
    }

    if (isTokenExpired || !token) {
        localStorage.removeItem('BooksAdminToken');
        // window.location.reload();
        return <Navigate to={RouteConstants.LOGIN} />;
    }

    // return isAdmin ? element : <Navigate to={RouteConstants.LOGIN} />;
    return isAdmin ? element : <Navigate to={'/'} />;
};

export default PrivateRoute;
