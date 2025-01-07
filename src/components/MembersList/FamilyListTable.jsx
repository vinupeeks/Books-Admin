import React, { useEffect, useState } from 'react'
import membershipsQueries from '../../queries/membershipQueries';

function FamilyListTable({ id }) {

    const [membersList, setMembersList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getFamilyMembersList = membershipsQueries.getFamilyMembersListMutation(
        async (response) => {
            setMembersList(response?.data?.data);
        },
        {
            onError: () => {
                setError('Failed to fetch fmaily members list, Please try again later.');
            },
        }
    );

    useEffect(() => {
        getFamilyMembersList.mutate({ id });
    }, []);

    return (
        <>
            {membersList && (
                <tr>
                    <td colSpan="5" className="bg-gray-50 p-3">
                        <h6 className="text-sm font-semibold text-gray-600 mb-2">
                            <u>Family Members List and Issued Status </u>
                        </h6>
                        <table className="min-w-full table-auto border-collapse rounded-lg border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-xs text-gray-600 border-b">Membership</th>
                                    <th className="px-4 py-2 text-left font-medium text-xs text-gray-600 border-b">Name</th>
                                    <th className="px-4 py-2 text-left font-medium text-xs text-gray-600 border-b">Book Title</th>
                                    <th className="px-4 py-2 text-left font-medium text-xs text-gray-600 border-b">Issue Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membersList?.map((membership) => (
                                    <tr key={membership.id + membership.contactNumber} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">{membership.memId}</td>
                                        <td className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">{membership.Name}</td>
                                        <td className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">{membership.bookTitle || "N/A"}</td>
                                        <td className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                            {membership?.issueDate ? new Date(membership.issueDate).toLocaleString() : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            )}
        </>
    )
}

export default FamilyListTable