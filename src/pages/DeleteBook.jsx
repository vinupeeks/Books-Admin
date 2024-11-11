import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({})
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();


  const handleDeleteBook = () => {

    const Token = localStorage.getItem('BooksAdminToken')
    if (!Token) {
      enqueueSnackbar('You need to log-In.', { variant: 'warning' });
      navigate('/login');
      return;
    }

    setLoading(true);
    axios.delete(`http://localhost:1000/books/${id}`, {
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book deleted successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error deleting book', { variant: 'error' });
        console.error(error);
      });
  };

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
