import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { useSnackbar } from 'notistack';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const bookingBtn = async () => {

    if (book.status === 'available') {

      const Token = localStorage.getItem('BooksAdminToken');
      if (!Token) {
        enqueueSnackbar('You need to log in to show the book.', { variant: 'warning' });
        navigate('/login');
        return;
      }

      const isConfirmed = window.confirm('Are you sure you want to reserve this book?');
      if (!isConfirmed) {
        return;
      }

      try {
        const response = await axios.post(`http://localhost:1000/cart/${book.id}`,
          { bookId: book.id },
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );

        if (response.status === 200) {
          enqueueSnackbar(`Book reserved successfully!`, { variant: 'success' });
          setBook((prevBook) => ({ ...prevBook, status: 'sold-out' }));
          // window.location.reload();
          // navigate(`/books/details/${book.id}`);
        } else {
          enqueueSnackbar(`Failed to reserve the book. Please try again.`, { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(`Error booking the book: ${error.message}`, { variant: 'error' });
      }

    } else {
      enqueueSnackbar(`Book is Already Sold-Out..!`, { variant: 'warning' });
      return;
    }
  }

  useEffect(() => {
    const fetchBooks = async () => {

      const Token = localStorage.getItem('BooksAdminToken');
      if (!Token) {
        enqueueSnackbar('You need to log in to show the book.', { variant: 'warning' });
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:1000/books/${id}`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        // console.log(`api response`, response)
        setBook(response.data || []);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [id]);

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Show Book</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Id</span>
            <span>{book.id}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Title</span>
            <span>{book.title}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Author</span>
            <span>{book.author}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Book Status</span>
            <span>{book.status}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Create Time</span>
            {/* <span>{new Date(book.createdAt).toString()}</span> */}
            <span>{new Date(book.createdAt).toLocaleString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
            <span>{new Date(book.updatedAt).toLocaleString()}</span>
          </div>
          <button className='w-fit px-4 py-1 bg-sky-300 rounded-lg' onClick={bookingBtn} disabled={book.status === 'sold-out'}>{book.status === 'available' ? 'BUY' : 'Sold-Out'}</button>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
