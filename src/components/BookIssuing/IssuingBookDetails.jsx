import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import bookQueries from '../../queries/bookQueries';

function IssuingBookDetails() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [error, setError] = useState(''); 

    const LastBooksDetails = bookQueries.LastBooksListMutation(
        (response) => {
            const bookList = response?.data || [];
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
            if (!text) return;

            setLoading(true);
            LastBooksDetails.mutateAsync({ text });
        }, 300),
        []
    );

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value === '') {
            setFilteredBooks([]);
            setSelectedBook(null);
        } else {
            debouncedSearch(value);
        }
    };

    const handleBookClick = (book) => {
        setSelectedBook(book);
        console.log(`Selected book details: `, book);

        setFilteredBooks([]);
        setSearchTerm('');
    };

    return (
        <div
        // className="min-h-screen flex flex-col items-center bg-gray-100 p-6"
        >
            <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-6">
                {/* Search Books */}
                <div className="mb-6">
                    <label htmlFor="searchBooks" className="block text-sm font-medium text-gray-700 mb-2">
                        Search Books
                    </label>
                    <input
                        type="text"
                        id="searchBooks"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Enter book title or ISBN"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Display Search Results */}
                {loading && <p className="text-blue-500">Loading books...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!selectedBook && filteredBooks.length > 0 && (
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Author</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-gray-100 cursor-pointer">
                                        <td className="px-4 py-2">{book.title}</td>
                                        <td className="px-4 py-2">{book.author}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                className="text-indigo-600 hover:underline"
                                                onClick={() => handleBookClick(book)}
                                            >
                                                ADD
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Display Selected Book */}
                {selectedBook && (
                    <div className="mt-6 p-6 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Book Details</h3>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500"
                                onClick={() => setSelectedBook(null)}
                            >
                                Clear
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-sm text-gray-700">
                                <strong className="block font-medium text-gray-800">Title:</strong>
                                {selectedBook.title}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong className="block font-medium text-gray-800">Author:</strong>
                                {selectedBook.author}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong className="block font-medium text-gray-800">ISBN:</strong>
                                {selectedBook.ISBN}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong className="block font-medium text-gray-800">Price:</strong>
                                {selectedBook.Price}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IssuingBookDetails;
