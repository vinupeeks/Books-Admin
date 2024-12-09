import React, { useEffect, useState, useCallback } from 'react';
import { getAuthToken } from '../../utils/TokenHelper';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import debounce from 'lodash.debounce';
import bookQueries from '../../queries/bookQueries';
import RouteConstants from '../../constant/Routeconstant';

function BookSearchComp(props) {
    const { selectedBook, setSelectedBook } = props;

    // const [books, setBooks] = useState([]);
    const [booksDup, setBooksDup] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            enqueueSnackbar('You need to log in to view the book list.', { variant: 'warning' });
            navigate(RouteConstants.LOGIN);
            return;
        }
    }, []);

    const LastBooksDetails = bookQueries.LastBooksListMutation(
        (response) => {
            const bookList = response?.data || [];

            setBooksDup(bookList);
            setFilteredBooks(bookList);
            setLoading(false);
        },
        {
            onError: (error) => {
                setError('Failed to fetch Books list. Please try again later.');
                setLoading(false);
            }
        }
    );

    const debouncedSearch = useCallback(
        debounce((text) => {
            if (!text) {
                return;
            }

            setLoading(true);
            LastBooksDetails.mutateAsync({ text });
        }, 300),
        []
    );


    const handleSearchChange = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value === '') {
            setFilteredBooks('');
        } else {
            debouncedSearch(value);
        }
    };
    const handleSelectBook = (book) => {
        setSelectedBook(book);
        setFilteredBooks([]);
        setBooksDup([]);
        setSearchTerm('')
        console.log(`Selected Book Details: `, selectedBook);
    }
    return (
        <div style={{ textAlign: 'center', alignItems: 'flex-start' }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* {!loading && !error && filteredBooks.length === 0 && <p>No books available.</p>} */}

            {
                selectedBook === null ? (
                    <input
                        type="text"
                        placeholder="Search by Book Title"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 my-2 w-full border rounded-md"
                    />
                ) : (
                    <div className="p-4">
                        <hr className="my-2" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Book Details</h2>
                        <ul className="list-none space-y-3">
                            <li className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Title:</span>
                                <span className="text-gray-800">{selectedBook.title}</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Author:</span>
                                <span className="text-gray-800">{selectedBook.author}</span>
                            </li>
                            {/* <li className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Price:</span>
                                <span className="text-gray-800">Rs {selectedBook.Price}</span>
                            </li> */}
                        </ul>

                        <div className="mt-4 flex items-end justify-end">
                            <button
                                className="px-4 py-2 bg-red-200 text-white rounded-lg hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                                onClick={() => setSelectedBook(null)}
                            >
                                Remove Book
                            </button>
                        </div>
                        <hr className="my-2" />
                    </div>
                )
            }


            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', verticalAlign: 'top' }}>
                <thead>
                    {filteredBooks.length > 0 && (
                        <tr style={{ backgroundColor: '#f2f2f2', verticalAlign: 'top' }}>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>ID</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Title</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Author</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Price</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Stock</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Options</th>
                        </tr>)}
                </thead>
                <tbody>
                    {(filteredBooks.length > 0 ? filteredBooks : booksDup)?.map((book, index) => (
                        <tr key={book?.id} style={{ verticalAlign: 'top' }}>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{index + 1}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{book?.title}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{book?.author}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{book?.Price}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>({book.Stock}) = {book?.AvailableStock}</td>
                            {/* <td style={{ border: '1px solid #ccc', padding: '10px', display: 'flex', justifyContent: 'center' }}> */}
                            {/* <BsInfoCircle className='text-2xl text-green-800' /> */}
                            {/* </td> */}
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                <button type="button"
                                    className={`px-1 py-1 rounded-lg mr-2 ${book?.AvailableStock > 0 ? 'bg-green-300 hover:bg-green-400' : 'bg-red-200 cursor-not-allowed'
                                        }`}
                                    disabled={book?.AvailableStock <= 0}
                                    onClick={() => { handleSelectBook(book) }}>SELECT</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
}

export default BookSearchComp;
