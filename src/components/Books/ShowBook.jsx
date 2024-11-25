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
    const Token = getAuthToken();
    if (!Token) {
      enqueueSnackbar('You need to log in to reserve the book.', { variant: 'warning' });
      navigate(RouteConstants.LOGIN);
      return;
    }

    if (book.status === 'available') {
      try {
        const response = await axios.post(
          `http://localhost:1000/cart/${book.id}`,
          {},
          { headers: { Authorization: `Bearer ${Token}` } }
        );

        if (response.status === 200) {
          enqueueSnackbar(`Book reserved successfully!`, { variant: 'success' });

          setLoading(true);
          try {
            const updatedResponse = await axios.get(`http://localhost:1000/books/${book.id}`);
            setBook(updatedResponse.data);
          } catch (error) {
            enqueueSnackbar(`Failed to fetch updated book details.`, { variant: 'warning' });
          } finally {
            setLoading(false);
          }

          navigate(`${RouteConstants.BOOKSDETAILS.replace(':id', book.id)}`);
        } else {
          enqueueSnackbar(`Failed to reserve the book. Please try again.`, { variant: 'error' });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'An error occurred while reserving the book.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Book is already sold out.', { variant: 'warning' });
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:1000/books/${id}`);
        setBook(response.data);
        console.log(`Book details: `, response.data);

      } catch (error) {
        enqueueSnackbar('Failed to fetch book details.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  return (
    <div className="p-4 flex justify-center items-center h-full flex-column">
      <h1 className="text-3xl my-4">Show Book</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">ID</span>
            <span>{book.id}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Title</span>
            <span>{book.title}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Author</span>
            <span>{book.author}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Stock</span>
            <span>{book.Stock ? `${book.Stock}` : 'N/A'}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Price</span>
            <span>{book.Price ? `$${book.Price.toFixed(2)}` : 'N/A'}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Status</span>
            <span>{book.status}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Created At</span>
            <span>{new Date(book.createdAt).toLocaleString()}</span>
          </div>
          <button
            className="w-fit px-4 py-2 bg-sky-300 rounded-lg"
            onClick={() => bookingBtn(book)}
          >
            {book.status === 'available' ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
