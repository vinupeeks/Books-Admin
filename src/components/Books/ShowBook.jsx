import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../utils/Spinner';
import { useSnackbar } from 'notistack';
import RouteConstants from '../../constant/Routeconstant';
import { getAuthToken } from '../../utils/TokenHelper';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const bookingBtn = async (book) => {
    const Token = getAuthToken;
    console.log(book);

    if (!Token) {
      enqueueSnackbar('You need to log in to reserve the book.', { variant: 'warning' });
      navigate(RouteConstants.LOGIN);
      return;
    }

    if (book.status === 'available') {
      try {
        console.log(`Booked Book id: `, book.id);

        const response = await axios.post(`http://localhost:1000/cart/${book.id}`, {}, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });

        if (response.status === 200) {
          enqueueSnackbar(`Book reserved successfully!`, { variant: 'success' });

          setLoading(true);
          try {
            const updatedResponse = await axios.get(`http://localhost:1000/books/${book.id}`);
            setBook(updatedResponse.data);
          } catch (error) {
            enqueueSnackbar(`Failed to fetch updated book: `, { variant: 'warning' });
          } finally {
            setLoading(false);
          }

          navigate(`${RouteConstants.BOKKSDETAILS.replace(':id', book.id)}`);

        } else {
          enqueueSnackbar(`Failed to reserve the book. Please try again.`, { variant: 'error' });
        }
      } catch (error) {
        if (error.response) {
          enqueueSnackbar(`Error booking the book: ${error.response.data.message}`, { variant: 'error' });
        } else {
          enqueueSnackbar(`Network error: ${error.message}`, { variant: 'error' });
        }
      }
    } else {
      enqueueSnackbar(`Book is Already Sold-Out..!`, { variant: 'warning' });
      return;
    }
  }

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:1000/books/${id}`);
        console.log(`API Response:`, response.data);
        setBook(response.data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [id]);

  return (
    <div className="p-4 flex justify-center items-center h-full flex-column">
      {/* <BackButton /> */}
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
            <span>{new Date(book.createdAt).toLocaleString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
            <span>{new Date(book.updatedAt).toLocaleString()}</span>
          </div>
          <button
            className='w-fit px-4 py-1 bg-sky-300 rounded-lg'
            onClick={() => bookingBtn(book)} // Pass book as argument
          >
            {book.status === 'available' ? 'ADD to Cart' : 'Sold-Out'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
