import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch users from the API
        const fetchUsers = async () => {
            try {
                // Make sure the URL matches the actual API endpoint
                const response = await axios.get('http://localhost:1000/admin-users/all');
                console.log('Fetched users:', response.data);

                // If the response is an array, set it to the state
                setUsers(response.data);
            } catch (err) {
                setError(err.message); // Handle any errors from the request
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>User List</h2>
            {users.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role ? 'Admin' : 'User'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default UsersList;
