import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../utils/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksTable from '../Books/BooksTable';
import BooksCard from '../Books/BooksCard';
import { useSnackbar } from 'notistack';
import { useViewContext } from '../../ViewContext';
import RouteConstants from '../../constant/Routeconstant';

const Home = () => {

  const { viewFormat } = useViewContext();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const Token = localStorage.getItem('BooksAdminToken')
    if (!Token) {
      enqueueSnackbar('You need to log-In.', { variant: 'warning' });
      navigate(RouteConstants.LOGIN);
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:1000/books/', {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        setBooks(response.data || []);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
