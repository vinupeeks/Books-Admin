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
          enqueueSnackbar('Book reserved successfully!', { variant: 'success' });

          setLoading(true);
          try {
            const updatedResponse = await axios.get(`http://localhost:1000/books/${book.id}`);
            setBook(updatedResponse.data);
            console.log(`Books details: `, book);

          } catch (error) {
            enqueueSnackbar('Failed to fetch updated book details.', { variant: 'warning' });
          } finally {
            setLoading(false);
          }

          navigate(`${RouteConstants.BOOKSDETAILS.replace(':id', book.id)}`);
        } else {
          enqueueSnackbar('Failed to reserve the book. Please try again.', { variant: 'error' });
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
        console.log(`Books details: `, response.data);
      } catch (error) {
        enqueueSnackbar('Failed to fetch book details.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  return (
    <div className="p-6 flex justify-center items-center h-full bg-gray-50">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Book Details</h1>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div className="font-semibold">ID:</div>
              <div>{book.id || 'N/A'}</div>
              <div className="font-semibold">Title:</div>
              <div>{book.title || 'N/A'}</div>
              <div className="font-semibold">Author:</div>
              <div>{book.author || 'N/A'}</div>
              <div className="font-semibold">Quantity:</div>
              <div>{book.Stock ? `${book.Stock}` : 'N/A'}</div>
              <div className="font-semibold">Price:</div>
              <div>{book.Price ? `$${book.Price.toFixed(2)}` : 'N/A'}</div>

              <div className="font-semibold">Donated By:</div>
              <div>{book.DonatedBy ? `${book.DonatedBy}` : 'N/A'}</div>

              <div className="font-semibold">Status:</div>
              <div>
                <span
                  className={`px-2 py-1 rounded text-sm ${book.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                    }`}
                >
                  {book.status || 'N/A'}
                </span>
              </div>
              <div className="font-semibold">Book added time:</div>
              <div>{book.createdAt ? new Date(book.createdAt).toLocaleString() : 'N/A'}</div>
            </div>
            {/* <button
              className={`mt-6 px-6 py-2 text-white rounded-lg font-medium ${book.status === 'available'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-400 cursor-not-allowed'
                }`}
              onClick={() => bookingBtn(book)}
              disabled={book.status !== 'available'}
            >
              {book.status === 'available' ? 'Reserve Book' : 'Sold Out'}
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowBook;
