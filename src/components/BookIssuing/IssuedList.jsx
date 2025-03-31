import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getAuthToken } from '../../utils/TokenHelper';
import debounce from 'lodash.debounce';
import issuesQueries from '../../queries/issuesQueries';
import Pagination from '../../common/Pagination/Pagination';
import Spinner from '../../utils/Spinner';
import { SquareArrowOutUpRight } from 'lucide-react';
import RouteConstants from '../../constant/Routeconstant';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../../redux/reducers/searchReducers';

const IssuedList = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visibleIndex, setVisibleIndex] = useState(null);
    const [showFullNumber, setShowFullNumber] = useState(false);

    const [searchTermComp, setSearchTermComp] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            enqueueSnackbar('You need to log in.', { variant: 'warning' });
            navigate('/login');
            return;
        }
        setLoading(true);
        fetchIssues();
    }, [currentPage, pageSize]);

    const getIssues = issuesQueries.issuedListMutation(
        async (response) => {
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
            search: searchTermComp,
        });
        getIssues.mutate(params.toString());
    };

    const handleSearchChange = async (event) => {
        const value = event.target.value;
        setSearchTermComp(value);
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

    const handleRemoveAndGo = () => {
        setSearchTermComp('')
        getIssues.mutateAsync();
    }

    const toggleVisibility = (index) => {
        setVisibleIndex(index);
        setShowFullNumber(true);

        setTimeout(() => {
            setShowFullNumber(false);
        }, 3000);
    };

    const handleGoReturnPage = (MemId) => {
        console.log(MemId);
        navigate(RouteConstants.DASHBOARD);
        dispatch(setSearchTerm(MemId));
    }

    return (
        <div className="px-3 pb-5">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl my-8">Issued Books List</h1>
                <div className='flex justify-between items-center gap-3'>
                    <input
                        type="text"
                        placeholder="Search by Book-Name / Member-ID"
                        value={searchTermComp}
                        onChange={(event) => {
                            handleSearchChange(event);
                        }}
                        className="border-2 border-sky-500 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-sky-500 p-1 w-[300px] uppercase"
                    />
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <Spinner />
            ) : issues?.length > 0 ? (
                <>
                    <div className="mb-4 text-black dark:text-gray-300">
                        {currentPage * pageSize + 1} - {currentPage * pageSize + issues?.length} out of {totalCount} issues.
                    </div>
                    <table
                        className='w-full border-separate border-spacing-2'
                    >
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="border border-slate-600 rounded-md px-4 py-2 text-center w-auto">#</th>
                                <th className="border border-gray-300 px-4 py-2 w-20">M_ID</th>
                                <th className="border border-gray-300 px-4 py-2">Member Name</th>
                                <th className="border border-gray-300 px-4 py-2">Contact Number</th>
                                <th className="border border-gray-300 px-4 py-2">Book Title</th>
                                <th className="border border-gray-300 px-4 py-2">Issue Date</th>
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
                                        <td className='border border-slate-700 rounded-md'>
                                            <div className="flex flex-row justify-around">
                                                <div key={issue.id} className="flex items-center gap-3">
                                                    <span>{new Date(issue.issueDate).toLocaleString()}</span>
                                                    <SquareArrowOutUpRight
                                                        className="w-5 h-5 cursor-pointer text-blue-300"
                                                        onClick={() => handleGoReturnPage(issue.Member.memID)}
                                                    />
                                                </div>
                                            </div>
                                        </td>
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
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPage}
                        pageSize={pageSize}
                        // show={true}
                        onPageChange={handlePageChange}
                        setPageSize={setPageSize}
                    />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-md shadow-md">
                    <svg
                        className="w-16 h-16 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        onClick={handleRemoveAndGo}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16l-4-4m0 0l4-4m-4 4h16"
                        />
                    </svg>
                    <h2 className="mt-4 text-lg font-semibold text-gray-700">No Issues Found</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        We couldn't find any Issues matching your search. Try modifying your criteria.
                    </p>
                </div>
            )}
        </div>
    );
};

export default IssuedList;
