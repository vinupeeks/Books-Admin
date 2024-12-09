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
      {/* <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6"> */}
      <div className="flex flex-col w-[800px] mx-auto h-[600px] bg-white shadow-lg rounded-lg p-6">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col w-[500px] mx-auto">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowBook;
