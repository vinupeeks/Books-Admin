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
        setError('Failed to fetch Books list. Please try again later.');
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
      <BackButton />
      <h1 className='text-3xl my-4'>Delete Book</h1>
      {loading && <Spinner />}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h6 className='text-2xl'>Are you sure you want to delete this book?</h6>
        <h3 className=''><b> Book Title:  </b> {book.title ? book.title : 'N/A'}</h3>
        <h3 className=' '><b> Author Name:  </b> {book.author ? book.author : 'N/A'}</h3>
        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteBook}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;
