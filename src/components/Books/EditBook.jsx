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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Update Book</h1>
      {loading && <Spinner />}
      <div className="flex flex-col border border-gray-300 rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6 bg-white"> 
        {/* Title Field */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-600 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Enter book title"
          />
        </div>
        {/* Author Field */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-600 mb-2">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Enter author's name"
          />
        </div>
        {/* Stock Field */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-600 mb-2">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Enter stock quantity"
          />
        </div>
        {/* ISBN Field */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-600 mb-2">ISBN</label>
          <input
            type="text"
            value={ISBN}
            onChange={(e) => setISBN(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Enter ISBN"
          />
        </div>
        {/* Price Field */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-600 mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Enter price"
          />
        </div>
        {/* Donated By Field */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-600 mb-2">Donated By</label>
          <input
            type="text"
            value={donatedBy}
            onChange={(e) => setDonatedBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Enter donor's name"
          />
        </div>
        {/* Status Field */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-600 mb-2">Status</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Enter status"
          />
        </div>
        {/* Save Button */}
        <button
          onClick={handleEditBook}
          className="w-full py-2 px-4 bg-sky-500 text-white text-lg font-medium rounded-lg hover:bg-sky-600 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
        >
          Save
        </button>
      </div>
    </div>

  );
};

export default EditBook;
