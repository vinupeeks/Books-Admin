import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';
import { FaCartArrowDown } from "react-icons/fa";
import LogDetails from './LogDetails.jsx';
import { useSnackbar } from 'notistack';
// import Navbar from '../components/home/Navbar';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const Token = localStorage.getItem('BooksAdminToken')
    if (!Token) {
      enqueueSnackbar('You need to log-In.', { variant: 'warning' });
      navigate('/login');
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
      <div className="flex justify-center items-center gap-x-4">
        <button
          className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
          onClick={() => setShowType('table')}
        >
          Table
        </button>
        <button
          className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
          onClick={() => setShowType('card')}
        >
          Card
        </button>
      </div>

      {/* <Navbar /> */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Books List</h1>
        <div className='flex justify-between items-center gap-3'>
          <Link to="/books/create">
            <MdOutlineAddBox className="text-sky-800 text-4xl" />
          </Link>
          {/* <Link to="/cart">
            <FaCartArrowDown className="text-sky-800 text-4xl" />
          </Link> */}
          {/* <LogDetails /> */}
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : books.length > 0 ? (
        showType === 'table' ? <BooksTable books={books} /> : <BooksCard books={books} />
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default Home;
