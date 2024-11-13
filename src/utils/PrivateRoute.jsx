import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getAuthToken } from './TokenHelper';

const PrivateRoute = ({ element }) => {
    const token = getAuthToken();
    let isAdmin = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // console.log(`Decoded : `, decodedToken);

            isAdmin = decodedToken.role;
        } catch (error) {
            console.error('Error decoding token', error);
        }
    }


    return isAdmin === 'admin' ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
