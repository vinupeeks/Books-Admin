import React, { useEffect, useState } from 'react';
import BackButton from '../../utils/BackButton';
import Spinner from '../../utils/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import RouteConstants from '../../constant/Routeconstant';
import { getAuthToken } from '../../utils/TokenHelper';
import bookQueries from '../../queries/bookQueries';
import ConfirmationBox from '../../utils/ConfirmationBox';

const DeleteBook = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const deleteBook = bookQueries.bookDeleteByIdMutation(
    async (response) => {
      setLoading(false);
      enqueueSnackbar(`${response.data.message} successfully..!`, { variant: 'success' });
      navigate(RouteConstants.BOOKS);
    },
    {
      onError: (error) => {
        setLoading(false);
        enqueueSnackbar('Error deleting book', { variant: 'error' });
        console.error(error);
      },
    }
  );

  const handleDeleteBook = () => {
    setShowConfirmation(true);
    // if (book.Issues && book.Issues.length > 0) {
    //   setShowModal(true);
    // } else {
    //   if (window.confirm("Are you sure you want to delete this book?")) {
    //     setLoading(true);
    //     deleteBook.mutate(id);
    //   }
    // }
  };
  const confirmDelete = () => {
    setShowConfirmation(false);
    // setShowConfirmation(true);
    if (book.Issues && book.Issues.length > 0) {
      setShowModal(true);
    } else {
      setLoading(true);
      deleteBook.mutate(id);
    }
    console.log("Book deleted!");
  };
  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getBookDetail = bookQueries.bookByIdMutation(
    async (response) => {
      setBook(response?.data || []);
      setLoading(false);
    },
    {
      onError: (error) => {
        setLoading(false);
        enqueueSnackbar('Failed to fetch book data. Please try again later.', { variant: 'warning' });
      },
    }
  );

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      enqueueSnackbar('You need to log in to view this page.', { variant: 'warning' });
      navigate(RouteConstants.LOGIN);
      return;
    }
    setLoading(true);
    getBookDetail.mutateAsync(id);
  }, [id]);

  return (
    <div className="p-6 px-10">
      <BackButton destination='/books' />
      {loading && <Spinner />}

      {!loading && (
        <div className='flex flex-col items-center border-2 border-red-500 rounded-xl w-[550px] p-8 mx-auto shadow-lg'>
          <h1 className='text-3xl text-center'>DELETE BOOK</h1>
          <hr className="my-2 border-t-4 border-red-500 w-full" />
          <h6 className='text-2xl font-bold text-red-600 mb-4'>
            Are you sure you want to delete this book?
          </h6>
          <div className='text-lg text-gray-700 mb-6'>
            <p><b>Book Title:</b> {book.title || 'N/A'}</p>
            <p><b>Author Name:</b> {book.author || 'N/A'}</p>
            <p><b>ISBN:</b> {book.ISBN || 'N/A'}</p>
            <p><b>Price:</b> {book.Price ? `RS ${book.Price}` : 'N/A'}</p>
            <p><b>Donated By:</b> {book.DonatedBy || 'N/A'}</p>
            <p><b>Stock:</b> {book.Stock || 'N/A'}</p>
          </div>
          <hr className="my-2 border-t-4 border-red-500 w-full" />
          <button
            className='p-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition'
            onClick={handleDeleteBook}
          >
            Yes, Delete it
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[600px] shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-center text-red-600">Book has been Issued</h3>
            <p className="text-gray-700 text-lg mb-4">
              This book cannot be deleted because the book has been Issued to the following members
            </p>
            <ul className="list-disc list-inside text-left mb-4">
              {book.Issues.map((issue) => (
                <li key={issue.id} className="text-gray-600">
                  <b>Member:</b> {issue.Member.name} (ID: {issue.Member.memID}) - <b>Issue Date:</b> {new Date(issue.issueDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
            <p className="text-gray-700 text-lg mb-4">
              Please return  the book to proceed with deletion.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmationBox
        isOpen={showConfirmation}
        title="Confirm Delete Book"
        message="Are you sure you want to delete this book? This action can't be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default DeleteBook;
