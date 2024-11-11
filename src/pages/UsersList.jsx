import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { useSnackbar } from 'notistack';
import { Navigate } from 'react-router-dom';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:1000/admin-users/all');
                console.log('Fetched users:', response.data);

                setUsers(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <Spinner />;
    if (error) {
        enqueueSnackbar('Error Fetching Users List', { variant: 'warning' });
        // Navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">User List</h2>
                {users.length > 0 ? (
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-600">Username</th>
                                <th className="px-4 py-2 text-left text-gray-600">Email</th>
                                <th className="px-4 py-2 text-left text-gray-600">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="px-4 py-2 text-gray-800">{user.username}</td>
                                    <td className="px-4 py-2 text-gray-800">{user.email}</td>
                                    <td className="px-4 py-2 text-gray-800">{user.role ? 'Admin' : 'User'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-600">No users found</p>
                )}
            </div>
        </div>
    );
};

export default UsersList;
