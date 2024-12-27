import React, { useState } from 'react';
import Spinner from '../../utils/Spinner';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import RouteConstants from '../../constant/Routeconstant';
import bookQueries from '../../queries/bookQueries';
import BackButton from '../../utils/BackButton';

const CreateBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [stock, setStock] = useState('');
  const [isbn, setIsbn] = useState('');
  const [price, setPrice] = useState('');
  const [donatedBy, setDonatedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const submitForm = bookQueries.booksAddMutation(
    async (response) => {
      if (response.status === 201) {
        setLoading(false);
        enqueueSnackbar('Book Created successfully', { variant: 'success' });
        navigate(RouteConstants.BOOKS);
      } else {
        setLoading(false);
        enqueueSnackbar('Error creating book. Check console for details.', { variant: 'error' });
      }
    },
    {
      onError: (error) => {
        setLoading(false);
        enqueueSnackbar('Error creating book. Check console for details.', { variant: 'error' });
      }
    }
  );

  const handleSaveBook = (e) => {
    e.preventDefault();

    // Validations
    if (!title || !author || !stock || !isbn || !price) {
      enqueueSnackbar('All fields are required', { variant: 'warning' });
      return;
    }

    if (isNaN(stock) || stock <= 0) {
      enqueueSnackbar('Stock must be a positive number', { variant: 'warning' });
      return;
    }

    if (isNaN(price) || price <= 0) {
      enqueueSnackbar('Price must be a positive number', { variant: 'warning' });
      return;
    }

    if (isbn.length !== 13) {
      enqueueSnackbar('ISBN must be a 13-character string', { variant: 'warning' });
      return;
    }

    try {
      const datavalues = {
        title,
        author,
        Stock: Number(stock),
        ISBN: isbn,
        Price: Number(price),
        DonatedBy: donatedBy,
      };

      setLoading(true);
      submitForm.mutateAsync(datavalues);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', { variant: 'error' });
    }
  };

  return (
    <div className="p-6">
      <BackButton destination='/books' />
      <h1 className="text-3xl font-bold text-center mb-6">Create Book</h1>
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
            min={0}
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
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
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
            min={0}
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
        {/* Save Button */}
        <button
          onClick={handleSaveBook}
          className="w-full py-2 px-4 bg-sky-500 text-white text-lg font-medium rounded-lg hover:bg-sky-600 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateBooks;
