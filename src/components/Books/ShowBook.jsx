import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Spinner from '../../utils/Spinner';
import { useSnackbar } from 'notistack';
import bookQueries from '../../queries/bookQueries';
import BackButton from '../../utils/BackButton';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

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
  const fetchBook = async () => {
    setLoading(true);
    getBookDetail.mutate(id);
  }

  useEffect(() => {
    fetchBook();
  }, [id]);

  return (<div className="p-6 px-10 flex-row justify-center items-center h-full bg-gray-50">
    <BackButton destination='/books' />
    <div className="flex flex-col w-[800px] mx-auto h-auto bg-white shadow-lg rounded-lg p-6">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col w-[600px] mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-600">BOOK DETAILS</h1>
          <hr className="my-2 border-t-2 border-gray-600" />
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div className="font-semibold">ID:</div>
            <div>{book.id || 'N/A'}</div>
            <div className="font-semibold">Title:</div>
            <div>{book.title || 'N/A'}</div>
            <div className="font-semibold">Author:</div>
            <div>{book.author || 'N/A'}</div>
            <div className="font-semibold">ISBN:</div>
            <div>{book.ISBN ? `${book.ISBN}` : 'N/A'}</div>
            <div className="font-semibold">Quantity:</div>
            <div>{book.Stock ? `${book.Stock}` : 'N/A'}</div>
            <div className="font-semibold">Price:</div>
            <div>{book.Price ? `Rs ${book.Price.toFixed(2)}` : 'N/A'}</div>
            <div className="font-semibold">Donated By:</div>
            <div>{book.DonatedBy ? `${book.DonatedBy}` : 'N/A'}</div>
            <div className="font-semibold">Book added time:</div>
            <div>{book.createdAt ? new Date(book.createdAt).toLocaleString() : 'N/A'}</div>
          </div>
          <hr className="my-2 border-t-2 border-gray-600" />
          <h2 className="text-xl font-bold text-center mt-4 mb-2 text-gray-600">Book Issued Members Details</h2>
          <div className="overflow-y-auto max-h-48">
            {book.Issues && book.Issues.length > 0 ? (
              <>
                <table className="table-auto w-full text-left border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-2 py-1">Mem ID</th>
                      <th className="border border-gray-300 px-2 py-1">Member Name</th>
                      <th className="border border-gray-300 px-2 py-1">Contact Number</th>
                      <th className="border border-gray-300 px-2 py-1 w-auto">Issue Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {book?.Issues?.map((issue, index) => (
                      <tr key={issue.id}>
                        <td className="border border-gray-300 px-2 py-1">{issue.Member?.memID || 'N/A'}</td>
                        <td className="border border-gray-300 px-2 py-1">{issue.Member?.name || 'N/A'}</td>
                        <td className="border border-gray-300 px-2 py-1">{issue.Member?.contactNumber || 'N/A'}</td>
                        <td className="border border-gray-300 px-2 py-1">
                          {issue.issueDate ? new Date(issue.issueDate).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <br />
                <hr className="my-2 border-t-2 border-gray-600" />
              </>
            ) : (
              <>
                <div className="text-center text-gray-500">No members found</div>
                <hr className="my-2 border-t-2 border-gray-600" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default ShowBook;
