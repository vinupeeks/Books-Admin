import React, { useCallback, useEffect, useState } from 'react';
import Spinner from '../../utils/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksTable from './BooksTable';
import BooksCard from './BooksCard';
import { useSnackbar } from 'notistack';
import { useViewContext } from '../../context/ViewContext';
import RouteConstants from '../../constant/Routeconstant';
import bookQueries from '../../queries/bookQueries';
import { getAuthToken } from '../../utils/TokenHelper';
import debounce from 'lodash.debounce';
import Pagination from '../../common/Pagination/Pagination';
import BackButton from '../../utils/BackButton';


const Home = () => {

  const { viewFormat } = useViewContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [show, setShow] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const Token = getAuthToken();
    if (!Token) {
      enqueueSnackbar('You need to log-In.', { variant: 'warning' });
      navigate(RouteConstants.LOGIN);
      return;
    }
    setLoading(true);
    fetchBooks();
  }, [currentPage, pageSize]);

  const getBooks = bookQueries.booksListMutation(
    async (response) => {
      setBooks(response?.data?.items);
      setTotalCount(response?.data?.totalItems);
      setTotalPage(response?.data?.totalPages);
      setLoading(false);
    },
    {
      onError: (error) => {
        setError('Failed to fetch Books list. Please try again later.');
      }
    }
  );
  const fetchBooks = () => {
    const params = new URLSearchParams({
      page: currentPage,
      size: pageSize,
      search: searchTerm,
      // filter: dateFilter 
    });
    getBooks.mutate(params.toString());
    // getBooks.mutate(buildParams());
  }

  const handleRemoveAndGo = () => {
    setSearchTerm('')
    getBooks.mutateAsync();
  }
  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  const buildParams = (value) => {
    const params = new URLSearchParams({
      search: value,
      page: currentPage,
      size: pageSize,
      // filter: dateFilter, 
    });
    setCurrentPage(0);
    return params.toString();
  };

  const debouncedSearch = useCallback(
    debounce((text) => {
      setLoading(true);
      if (!text) {
        getBooks.mutateAsync();
      }
      const params = buildParams(text);
      getBooks.mutateAsync(params);
    }, 500),
    []
  );
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="px-3 pb-5">
      {/* <BackButton destination='/dashboard' /> */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Books List</h1>
        <div className='flex justify-between items-center gap-3'>
          <input
            type="text"
            placeholder="Search by Book-Name"
            value={searchTerm}
            onChange={(event) => {
              handleSearchChange(event);
            }}
            className="border-2 border-sky-500 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-sky-500 p-1 w- uppercase"
          />
          <Link to="/books/create">
            <MdOutlineAddBox className="text-sky-800 text-4xl" />
          </Link>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : books?.length > 0 ? (
        viewFormat === 'table' ?
          <>
            <BooksTable books={books} currentPage={currentPage} pageSize={pageSize} totalCount={totalCount} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPage}
              pageSize={pageSize}
              show={show}
              setPageSize={setPageSize}
              onPageChange={handlePageChange}
            />
          </>
          : <BooksCard books={books} />
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
          <h2 className="mt-4 text-lg font-semibold text-gray-700">No Books Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            We couldn't find any books matching your search. Try modifying your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
