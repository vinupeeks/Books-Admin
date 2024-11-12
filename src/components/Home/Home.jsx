import React, { useEffect, useState } from 'react';
import Spinner from '../../utils/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksTable from '../Books/BooksTable';
import BooksCard from '../Books/BooksCard';
import { useSnackbar } from 'notistack';
import { useViewContext } from '../../context/ViewContext';
import RouteConstants from '../../constant/Routeconstant';
import bookQueries from '../../queries/bookQueries';
import { getAuthToken } from '../../utils/TokenHelper';


const Home = () => {

  const { viewFormat } = useViewContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
  }, []);

  const getBooks = bookQueries.booksListMutation(
    async (response) => {
      setBooks(response?.data || []);
      setLoading(false);
    },
    {
      onError: (error) => {
        setError('Failed to fetch Books list. Please try again later.');
      }
    }
  );
  const fetchBooks = () => {
    getBooks.mutate();
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Books List</h1>
        <div className='flex justify-between items-center gap-3'>
          <Link to="/books/create">
            <MdOutlineAddBox className="text-sky-800 text-4xl" />
          </Link>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : books.length > 0 ? (
        viewFormat === 'table' ? <BooksTable books={books} /> : <BooksCard books={books} />
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default Home;
