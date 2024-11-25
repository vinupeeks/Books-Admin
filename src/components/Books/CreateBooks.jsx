import React, { useState } from 'react';
import Spinner from '../../utils/Spinner';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import RouteConstants from '../../constant/Routeconstant';
import bookQueries from '../../queries/bookQueries';

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
      console.log(`Adding Book Response: `, response);

      if (response.status === 201) {
        setLoading(false);
        enqueueSnackbar('Book Created successfully', { variant: 'success' });
        navigate(RouteConstants.ROOT);
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
      console.log(`Data from front-end: `, datavalues);

      setLoading(true);
      submitForm.mutateAsync(datavalues);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', { variant: 'error' });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4">Create Book</h1>
      {loading && <Spinner />}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">ISBN</label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Donated By</label>
          <input
            type="text"
            value={donatedBy}
            onChange={(e) => setDonatedBy(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <button className="p-2 bg-sky-300 m-8" onClick={handleSaveBook}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateBooks;
