import React, { useEffect, useState } from 'react';
import BackButton from '../../utils/BackButton';
import Spinner from '../../utils/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import RouteConstants from '../../constant/Routeconstant';
import { getAuthToken } from '../../utils/TokenHelper';
import bookQueries from '../../queries/bookQueries';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({})
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const deleteBook = bookQueries.bookDeleteByIdMutation(
    async (response) => {
      console.log(response);

      setLoading(false);
      enqueueSnackbar(`${response.data.message} successfully..!`, { variant: 'success' });
      navigate(RouteConstants.ROOT);
    },
    {
      onError: (error) => {
        setLoading(false);
        enqueueSnackbar('Error deleting book', { variant: 'error' });
        console.error(error);
      }
    }
  )

  const handleDeleteBook = () => {
    setLoading(true);
    deleteBook.mutate(id);
  }

  const getBookDetail = bookQueries.bookByIdMutation(
    async (response) => {
      setBook(response?.data || []);
      setLoading(false);

    },
    {
      onError: (error) => {
        setLoading(false);
        setError('Failed to fetch Book data. Please try again later.');
        enqueueSnackbar(error.response.data.message, { variant: 'warning' });
      }
    }
  )

  useEffect(() => {
    const Token = getAuthToken();
    if (!Token) {
      enqueueSnackbar('You need to log in to show the book.', { variant: 'warning' });
      navigate(RouteConstants.LOGIN);
      return;
    }
    setLoading(true);
    getBookDetail.mutateAsync(id);
  }, [id])


  return (
    <div className='p-4'>
      {loading && <Spinner />}
      <div className='flex flex-col items-center border-2 border-red-500 rounded-xl w-[600px] p-8 mx-auto shadow-lg'>
        <h1 className='text-3xl text-center'>DELETE BOOK</h1> 
        <hr className="my-2 border-t-4 border-red-500 w-full" />
        <h6 className='text-2xl font-bold text-red-600 mb-4'>
          Are you sure you want to delete this book?
        </h6>
        <div className='text-lg text-gray-700 mb-6'>
          <p><b>Book Title :</b> {book.title || 'N/A'}</p>
          <p><b>Author Name :</b> {book.author || 'N/A'}</p>
          <p><b>ISBN :</b> {book.ISBN || 'N/A'}</p>
          <p><b>Price :</b> {book.Price && `RS ${book.Price}` || 'N/A'}</p>
          <p><b>Donated By :</b> {book.DonatedBy || 'N/A'}</p>
          <p><b>Stock :</b> {book.Stock || 'N/A'}</p>
        </div> 
        <hr className="my-2 border-t-4 border-red-500 w-full" />
        <button
          className='p-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition'
          onClick={handleDeleteBook}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;
