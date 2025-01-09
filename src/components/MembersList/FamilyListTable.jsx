import React, { useEffect, useState } from 'react'
import membershipsQueries from '../../queries/membershipQueries';
import { SquareArrowOutUpRight } from 'lucide-react';
import RouteConstants from '../../constant/Routeconstant';
import { setSearchTerm } from '../../redux/reducers/searchReducers';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function FamilyListTable({ id, selectedMem }) {

    const [membersList, setMembersList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [combinedData, setCombinedData] = useState(selectedMem ? [selectedMem] : []);

    const getFamilyMembersList = membershipsQueries.getFamilyMembersListMutation(
        async (response) => {
            setMembersList(response?.data?.data);
            setCombinedData([...combinedData, ...response?.data?.data]);
            console.log(`combinedData: `, combinedData);

        },
        {
            onError: () => {
                setError('Failed to fetch fmaily members list, Please try again later.');
            },
        }
    );

    const handleGoReturnPage = (memID) => {
        console.log(memID);
        dispatch(setSearchTerm(memID));
        navigate(RouteConstants.DASHBOARD);
    }

    useEffect(() => {
        getFamilyMembersList.mutate({ id });
        return () => {
            setCombinedData([]);
            setMembersList([]);
        }
    }, []);

    return (
        <>
            {combinedData && (
                <tr>
                    {console.log(combinedData)
                    }
                    <td colSpan="5" className="bg-gray-50 p-3">
                        <h6 className="text-sm font-semibold text-gray-600 mb-2">
                            <u>F{id} Family Members List and Issued Status </u>
                        </h6>
                        <table className="min-w-full table-auto border-collapse rounded-lg border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-xs text-gray-600 border-b">Membership</th>
                                    <th className="px-4 py-2 text-left font-medium text-xs text-gray-600 border-b">Name</th>
                                    <th className="px-4 py-2 text-left font-medium text-xs text-gray-600 border-b">Book Title</th>
                                    <th className="px-4 py-2 text-left font-medium text-xs text-gray-600 border-b">Issue Date</th>
                                    <th className="px-4 py-2 text-left font-medium text-xs text-gray-600 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {combinedData?.map((membership) => (
                                    <tr key={membership.id + membership.contactNumber} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">{membership.memId || membership.memID}</td>
                                        <td className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">{membership.Name || membership.name}</td>
                                        <td className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">{membership.bookTitle || "N/A"}</td>
                                        <td className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                            {membership?.issueDate ? new Date(membership.issueDate).toLocaleString() : "N/A"}
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                            <div className="flex items-center justify-between gap-2">
                                                <button
                                                    type="button"
                                                    className="flex justify-center items-center w-8 h-8 from-cyan-200 to-blue-200 rounded-full hover:bg-gray-300"
                                                // onClick={() => openModal(membership)}
                                                >
                                                    <SquareArrowOutUpRight
                                                        className="w-5 h-5 cursor-pointer text-blue-300"
                                                        // onClick={() =>
                                                        //     handleGoReturnPage(membership.memID)
                                                        //     // console.log(membership.memId)
                                                        // }
                                                        onClick={() => {
                                                            if (membership && membership.memId) {
                                                                handleGoReturnPage(membership.memId);
                                                            } else {
                                                                console.error("membership.memID is undefined");
                                                            }
                                                        }}
                                                    />
                                                </button>
                                            </div>
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