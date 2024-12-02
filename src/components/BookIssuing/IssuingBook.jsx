import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constant/Routeconstant'; 
import BookSearchComp from './BookSearchComp';

function IssuingBook() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [error, setError] = useState('');
    const [membershipId, setMembershipId] = useState('');
    const [membershipDetails, setMembershipDetails] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [memberError, setMemberError] = useState('');
    const navigate = useNavigate();

    const fetchMembershipDetails = async (id) => {
        if (!id.trim()) return;

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:1000/membership/list?id=${id}`);
            if (response.data.success) {
                setMembershipDetails(response.data.details);
                setMemberError('');
            } else {
                setMembershipDetails([]);
                setMemberError('No membership details found.');
            }
        } catch (err) {
            setMembershipDetails([]);
            setMemberError('Failed to fetch membership details. Please try again later.');
        }
        setLoading(false);
    };

    // Trigger membership search automatically when membershipId changes
    useEffect(() => {
        fetchMembershipDetails(membershipId);
    }, [membershipId]);

    const handleMemberSelect = (member) => {
        setSelectedMember(member);
        setMembershipDetails([]);
        setMembershipId('');
    };

    const debouncedSearch = useCallback(
        debounce((text) => {
            if (!text) return;

            setLoading(true);
            //  API 
        }, 300),
        []
    );

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value === '') {
            setFilteredBooks([]);
            setSelectedBook(null);
        } else {
            debouncedSearch(value);
        }
    };

    const handleBookClick = (book) => {
        setSelectedBook(book);
        setFilteredBooks([]);
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Issue a Book
                </h1>

                {/* <s>hello</s> */}
                {/* <BookSearchComp /> */}
                {/* <s>hello</s> */}
                <br />
                <div
                    className="mb-6 max-w-xl w-full bg-white shadow-lg rounded-lg p-6">
                    <label htmlFor="membershipId" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Membership ID
                    </label>
                    <input
                        type="text"
                        id="membershipId"
                        value={membershipId}
                        onChange={(e) => setMembershipId(e.target.value)}
                        placeholder="Enter membership ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {loading && <p className="text-blue-500 mt-2">Loading memberships...</p>}
                    {memberError && <p className="text-red-500 mt-2">{memberError}</p>}
                </div>

                {membershipDetails.length > 0 && (
                    <div className="mb-6 max-w-xl overflow-x-auto mt-4">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Contact</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Flat No.</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membershipDetails.map((detail) =>
                                    detail.MembershipDetails.map((m) => (
                                        <tr key={m.Member.id} className="hover:bg-gray-100 cursor-pointer">
                                            <td className="px-4 py-2">{m.Member.name}</td>
                                            <td className="px-4 py-2">{m.Member.contactNumber}</td>
                                            <td className="px-4 py-2">{m.Member.flatNumber}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    className="text-indigo-600 hover:underline"
                                                    onClick={() => handleMemberSelect(m.Member)}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {selectedMember && (
                    <div className="mb-6 max-w-xl mt-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white flex flex-col space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Selected Member</h3>
                        <div className="grid grid-cols-2 gap-x-4">
                            <div className="text-sm text-gray-700">
                                <span className="font-medium text-gray-800">Name:</span> {selectedMember.name}
                            </div>
                            <div className="text-sm text-gray-700">
                                <span className="font-medium text-gray-800">Contact:</span> {selectedMember.contactNumber}
                            </div>
                            <div className="text-sm text-gray-700">
                                <span className="font-medium text-gray-800">Flat No:</span> {selectedMember.flatNumber}
                            </div>
                        </div>
                        <button
                            className="self-end mt-4 bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                            onClick={() => setSelectedMember(null)}
                        >
                            Clear
                        </button>
                    </div>
                )}
                {/* Actions */}
                <div className="flex justify-end mt-6 gap-2">
                    <button
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                        onClick={() => {
                            navigate(RouteConstants.DASHBOARD);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        disabled={!selectedBook || !selectedMember}
                    >
                        Proceed to Issue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IssuingBook;
