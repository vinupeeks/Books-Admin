import { jwtDecode } from 'jwt-decode';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RouteConstants from '../../constant/Routeconstant';

function LogDetails({ handleLOGOUT }) {
    const [user, setUser] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const Token = localStorage.getItem('BooksAdminToken');
        if (Token) {
            try {
                const decodedToken = jwtDecode(Token);
                setUser(decodedToken);
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('BooksAdminToken');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    return (
        <div>
            {user ? (
                <button
                    className="w-fit px-4 py-1 rounded-lg text-white hover:bg-[#92C5FC]"
                    style={{ backgroundColor: '#1976D2' }}
                // onClick={handleLogout}
                >
                    LogOut
                </button>
            ) : (
                <Link to={RouteConstants.LOGIN} className="w-fit px-4 py-1 rounded-lg text-white hover:bg-blue-300"
                    style={{ backgroundColor: '#1976D2' }}
                >
                    Log In
                </Link>
            )}
        </div>
    );
}

export default LogDetails;
