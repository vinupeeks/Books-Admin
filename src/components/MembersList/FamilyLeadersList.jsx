import { ChevronDown, ChevronUp, NotepadText, SquareArrowOutUpRight, SquarePen } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import FamilyListTable from './FamilyListTable';
import membershipsQueries from '../../queries/membershipQueries';
import { setSearchTerm } from '../../redux/reducers/searchReducers';
import RouteConstants from '../../constant/Routeconstant';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import Pagination from '../../common/Pagination/Pagination';

function FamilyLeadersList() {
    const [loading, setLoading] = useState(true);
    const [totalPage, setTotalPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [FamilyList, setFamilyList] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedMem, setSelectedMem] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getFamilyLeadersList = membershipsQueries.getFamilyLeadersListMutation(
        async (response) => {
            setFamilyList(response?.data?.data?.items);
            // setMemberships(response?.data || []); 
            setTotalCount(response?.data?.data?.totalItems);
            setTotalPage(response?.data?.data?.totalPages);
            setLoading(false);
        },
        {
            onError: (error) => {
                setError("Error fetching Family Leaders data");
                setLoading(false);
            }
        }
    );

    const fetchFamilyLeadersList = async () => {
        const payload = {
            page: currentPage,
            size: pageSize,
        }
        getFamilyLeadersList.mutate(payload);
    }
    useEffect(() => {
        setLoading(true);
        fetchFamilyLeadersList();
    }, [currentPage, pageSize]);

    const handleToggleRow = (membershipId) => {
        setExpandedRow(prevRow => (prevRow === membershipId.id ? null : membershipId.id));
        console.log(`Expanded Row:`, membershipId);
        if (membershipId) {
            const transformedMember = {
                id: membershipId.id,
                memId: membershipId.memID,
                Name: membershipId.name,
                bookTitle: membershipId.Issues[0]?.Book?.title || "",
                issueDate: membershipId.Issues[0]?.issueDate || ""
            }
            setSelectedMem(transformedMember);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const handleGoReturnPage = (MemId) => {
        console.log(MemId);
        navigate(RouteConstants.DASHBOARD);
        dispatch(setSearchTerm(MemId));
    }

    return (
        <div className='p-3'>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl my-8">Family Leaders List</h1>
                <div className='flex justify-between items-center gap-3'>
                    {/* <input
                        type="text"
                        placeholder="Search by Family Leader ID"
                        // value={searchTerm}
                        onChange={(event) => {
                            // handleSearchChange(event);
                        }}
                        className="border-2 border-sky-500 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-sky-500 p-1 w-[230px] uppercase"
                    /> */}
                    <Link to="/membership/creation">
                        <MdOutlineAddBox className="text-sky-800 text-4xl" />
                    </Link>
                </div>
            </div>
            {FamilyList?.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <div className=" text-black dark:text-gray-300 p-3">
                        &nbsp; {currentPage * pageSize + 1} - {currentPage * pageSize + FamilyList.length} out of {totalCount} members.
                    </div>
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="px-4 py-2 text-center w-10">#</th>
                                <th className="px-4 py-2 text-center w-25">Membership ID</th>
                                <th className="px-4 py-2 text-center w-auto">Name</th>
                                {/* <th className="px-4 py-2 text-left w-auto">Status</th> */}
                                <th className="px-4 py-2 text-center w-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {FamilyList?.map((membership, index) => {
                                const hasBook = membership.Member.Issues.some((issue) => issue.Book);
                                const isRowExpanded = expandedRow === membership.Member.id;
                                return (
                                    <>
                                        <tr
                                            key={membership.Member.id + membership.Member.memID}
                                            className={`border-b hover:bg-gray-100 ${hasBook ? "bg-gradient-to-r from-cyan-100 to-blue-100" : "bg-gray-200"}`}
                                        >
                                            <td className="px-4 py-2">
                                                {currentPage * pageSize + index + 1}
                                            </td>
                                            <td className="px-4 py-2  text-center">{membership.Member.memID}</td>
                                            <td className="px-4 py-2  text-center">{membership.Member.name}</td>
                                            {/* <td className="px-4 py-2">
                                                {membership.Member.Issues.length > 0 ? (
                                                    <div className="flex flex-col gap-2">
                                                        {membership.Member.Issues.map((issue) => (
                                                            <div key={issue.id} className="flex items-center gap-2">
                                                                <NotepadText
                                                                    className="w-5 h-5"
                                                                    // onMouseEnter={() => handleShow(issue)}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                                <span>{issue.Book && issue.Book.title ? issue.Book.title : "No title available"}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">---</p>
                                                )}
                                            </td> */}
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex items-center justify-between gap-2">
                                                    <button
                                                        type="button"
                                                        className="flex justify-center items-center w-8 h-8 from-cyan-200 to-blue-200 rounded-full hover:bg-gray-300"
                                                        onClick={() =>
                                                            handleToggleRow(membership.Member)
                                                            // console.log(membership.Member)

                                                        }
                                                    >
                                                        {
                                                            expandedRow && isRowExpanded ? (
                                                                <ChevronUp className="w-5 h-5" />
                                                            ) : (
                                                                <ChevronDown className="w-5 h-5" />
                                                            )
                                                        }
                                                    </button>
                                                    {/* {membership.Member.memID.startsWith("F") ? (
                                                        <button
                                                            type="button"
                                                            className="flex justify-center items-center w-8 h-8 from-cyan-200 to-blue-200 rounded-full hover:bg-gray-300"
                                                            onClick={() => handleToggleRow(membership.Member.id)}
                                                        >
                                                            {
                                                                expandedRow && isRowExpanded ? (
                                                                    <ChevronUp className="w-5 h-5" />
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5" />
                                                                )
                                                            }
                                                        </button>
                                                    ) : (
                                                        <div className="w-8 h-8"></div>
                                                    )} */}

                                                    <button
                                                        type="button"
                                                        className="flex justify-center items-center w-8 h-8 from-cyan-200 to-blue-200 rounded-full hover:bg-gray-300"
                                                    >
                                                        <SquareArrowOutUpRight
                                                            className="w-5 h-5 cursor-pointer text-blue-300"
                                                            onClick={() =>
                                                                handleGoReturnPage(membership.Member.memID)
                                                                // console.log(membership.Member.memID)

                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {
                                            expandedRow && isRowExpanded && (
                                                <FamilyListTable id={expandedRow} selectedMem={selectedMem} />
                                            )
                                        }
                                    </>
                                );
                            })}
                        </tbody>

                    </table>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPage}
                        pageSize={pageSize}
                        // setPageSize={setPageSize}
                        // show={show}
                        onPageChange={handlePageChange} />
                    <br />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-md shadow-md">
                    <h2 className="mt-4 text-lg font-semibold text-gray-700">No Family Leaders Found</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {/* We couldn't find any members matching your search. Try modifying your criteria. */}
                        Because you have no family memberships..!
                    </p>
                </div>
            )
            }
        </div>
    )
}

export default FamilyLeadersList