import React, { useEffect, useState, useCallback } from 'react';
import { getAuthToken } from '../../utils/TokenHelper';
import RouteConstants from '../../constant/Routeconstant';
import bookQueries from '../../queries/bookQueries';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import debounce from 'lodash.debounce';

function LastBooks() {
    const [books, setBooks] = useState([]);
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
        fetchLastBooks();
    }, []);

    const fetchLastBooks = async () => {
        setLoading(true);
        LastBooksDetails.mutateAsync();
    };

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
            // fetchFilteredBooks(text);
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
            // setFilteredBooks(booksDup);
        } else {
            debouncedSearch(value);
        }
    };

    return (
        <div style={{ textAlign: 'center', alignItems: 'flex-start' }}>
            <h2>Fresh Books</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && filteredBooks.length === 0 && <p>No books available.</p>}

            <input
                type="text"
                placeholder="Search by Book Title"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ padding: '8px', margin: '10px 0', width: '100%' }}
            />

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', verticalAlign: 'top' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', verticalAlign: 'top' }}>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>ID</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Title</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Author</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {(filteredBooks.length > 0 ? filteredBooks : booksDup)?.map((book, index) => (
                        <tr key={book?.id} style={{ verticalAlign: 'top' }}>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{index + 1}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{book?.title}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{book?.author}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{book?.Price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LastBooks;
