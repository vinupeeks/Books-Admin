import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getAuthToken } from '../../utils/TokenHelper';
import debounce from 'lodash.debounce';
import issuesQueries from '../../queries/issuesQueries';
import Pagination from '../../common/Pagination/Pagination';

const IssuedList = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visibleIndex, setVisibleIndex] = useState(null);
    const [showFullNumber, setShowFullNumber] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            enqueueSnackbar('You need to log in.', { variant: 'warning' });
            navigate('/login'); // Adjust the route if necessary
            return;
        }
        setLoading(true);
        fetchIssues();
    }, [currentPage, pageSize, searchTerm]);

    const getIssues = issuesQueries.issuedListMutation(
        async (response) => {
            console.log(`Repo: `, response?.data);
            console.log({
                totalPage: totalPage,
                totalCount: totalCount,
                currentPage: currentPage,
                pageSize: pageSize
            });

            setIssues(response?.data?.items);
            setTotalCount(response?.data?.totalItems);
            setTotalPage(response?.data?.totalPages);
            setLoading(false);
        },
        {
            onError: () => {
                setError('Failed to fetch issued items. Please try again later.');
                setLoading(false);
            },
        }
    );

    const fetchIssues = () => {
        const params = new URLSearchParams({
            page: currentPage,
            size: pageSize,
            search: searchTerm,
        });
        getIssues.mutate(params.toString());
    };

    const handleSearchChange = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const buildParams = (value) => {
        const params = new URLSearchParams({
            search: value,
            page: 0,
            size: pageSize,
        });
        setCurrentPage(0);
        return params.toString();
    };

    const debouncedSearch = useCallback(
        debounce((text) => {
            setLoading(true);
            const params = buildParams(text);
            getIssues.mutate(params);
        }, 700),
        []
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const toggleVisibility = (index) => {
        setVisibleIndex(index); // Set the clicked index
        setShowFullNumber(true); // Initially show masked number

        // Set a timeout to reveal the full number after 5 seconds
        setTimeout(() => {
            setShowFullNumber(false);
        }, 3000);
    };

    return (
        <div className="px-3 pb-5">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl my-8">Issued Books List</h1>
                <div className='flex justify-between items-center gap-3'>
                    <input
                        type="text"
                        placeholder="Search by Book-Name / Member-ID"
                        value={searchTerm}
                        onChange={(event) => {
                            handleSearchChange(event);
                        }}
                        className="border-2 border-sky-500 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-sky-500 p-1 w-[300px] uppercase"
                    />
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="mb-4 text-black dark:text-gray-300">
                        {currentPage * pageSize + 1} - {currentPage * pageSize + issues.length} out of {totalCount} issues.
                    </div>
                    <table
                        // className="table-auto w-full border-collapse border border-gray-200"
                        className='w-full border-separate border-spacing-2'
                    >
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="border border-slate-600 rounded-md px-4 py-2 text-left w-auto">SLN</th>
                                <th className="border border-gray-300 px-4 py-2 w-20">M_ID</th>
                                <th className="border border-gray-300 px-4 py-2">Member Name</th>
                                <th className="border border-gray-300 px-4 py-2">Contact Number</th>
                                <th className="border border-gray-300 px-4 py-2">Book Title</th>
                                <th className="border border-gray-300 px-4 py-2">Issue Date</th>
                                {/* <th className="border border-gray-300 px-4 py-2">Author</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {issues?.length > 0 ? (
                                issues?.map((issue, index) => (
                                    <tr key={issue.id} className="h-8 hover:bg-gray-200 transition-colors">
                                        <td className='border border-slate-700 rounded-md text-center'>{currentPage * pageSize + index + 1}</td>
                                        <td className='border border-slate-700 rounded-md text-center'>{issue.Member.memID}</td>
                                        <td className='border border-slate-700 rounded-md text-center'>{issue.Member.name}</td>
                                        <td
                                            className="border border-slate-700 rounded-md text-center cursor-pointer"
                                            onClick={() => toggleVisibility(index)}
                                        >
                                            {visibleIndex === index && showFullNumber
                                                ? issue.Member.contactNumber
                                                : `******${issue.Member.contactNumber.slice(-4)}`}
                                        </td>
                                        <td className='border border-slate-700 rounded-md text-center'>{issue.Book.title}</td>
                                        <td className='border border-slate-700 rounded-md text-center'>{new Date(issue.issueDate).toLocaleString()}</td>
                                        {/* <td className='border border-slate-700 rounded-md text-center'>{issue.Book.author}</td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center p-4">
                                        No issued items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                pageSize={pageSize}
                // show={true}
                onPageChange={handlePageChange}
                setPageSize={setPageSize}
            />
        </div>
    );
};

export default IssuedList;
