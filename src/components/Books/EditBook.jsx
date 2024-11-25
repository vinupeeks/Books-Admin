import React, { useState, useEffect } from 'react';
import BackButton from '../../utils/BackButton';
import Spinner from '../../utils/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import RouteConstants from '../../constant/Routeconstant';
import bookQueries from '../../queries/bookQueries';
import { getAuthToken } from '../../utils/TokenHelper';

const EditBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [stock, setStock] = useState('');
  const [ISBN, setISBN] = useState('');
  const [price, setPrice] = useState('');
  const [donatedBy, setDonatedBy] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const getBookDetail = bookQueries.bookByIdMutation(
    async (response) => {
      const { title, author, Stock, ISBN, Price, DonatedBy, status } = response.data;
      setTitle(title);
      setAuthor(author);
      setStock(Stock);
      setISBN(ISBN);
      setPrice(Price);
      setDonatedBy(DonatedBy);
      setStatus(status);
      setLoading(false);
    },
    {
      onError: (error) => {
        setLoading(false);
        enqueueSnackbar('Failed to fetch book data. Please try again later.', { variant: 'warning' });
        console.error(error);
      }
    }
  );

  useEffect(() => {
    const Token = getAuthToken();
    if (!Token) {
      enqueueSnackbar('You need to log in to edit the book.', { variant: 'warning' });
      navigate(RouteConstants.LOGIN);
      return;
    }
    setLoading(true);
    getBookDetail.mutateAsync(id);
  }, [id]);

  const editBook = bookQueries.bookEditByIdMutation(
    async (response) => {
      setLoading(false);
      enqueueSnackbar(`${response.data.message} successfully..!`, { variant: 'success' });
      navigate(RouteConstants.ROOT);
    },
    {
      onError: (error) => {
        setLoading(false);
        enqueueSnackbar('Error editing book', { variant: 'error' });
        console.error(error);
      }
    }
  );

  const handleEditBook = () => {
    const data = {
      id,
      title,
      author,
      Stock: stock,
      ISBN,
      Price: price,
      DonatedBy: donatedBy,
      status
    };
    setLoading(true);
    editBook.mutateAsync(data);
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Edit Book</h1>
      {loading && <Spinner />}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Stock</label>
          <input
            type='number'
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>ISBN</label>
          <input
            type='text'
            value={ISBN}
            onChange={(e) => setISBN(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Price</label>
          <input
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Donated By</label>
          <input
            type='text'
            value={donatedBy}
            onChange={(e) => setDonatedBy(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Status</label>
          <input
            type='text'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleEditBook}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditBook;
