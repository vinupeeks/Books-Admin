import * as React from 'react';
import { useState, useEffect } from 'react';
import BookSingleCart from './BookSingleCart.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constant/Routeconstant.jsx';


export default function BasicCard() {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    const NvBtn = () => {
        navigate(RouteConstants.ROOT);
    }

    useEffect(() => {
        const Token = localStorage.getItem('BooksAdminToken');

        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:1000/cart', {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                });
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, []);

    const removeBookFromState = (id) => {
        setBooks((prevBooks) => prevBooks.filter((book) => book.BookCartId !== id));
    };

    return (
        <>
            <h1 className="text-3xl my-8">BOOKS LIST</h1>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {books && books.length > 0 ? (
                    books.map((item) => (
                        <div key={item.BookId}>
                            <BookSingleCart book={item} onRemove={removeBookFromState} />
                        </div>
                    ))
                ) : (
                    <div className='col-span-full text-center'>
                        {/* <h2>No cart details held</h2> */}
                        <h1 className="text-3xl my-8">No cart details held</h1>
                        <p>Your cart is currently empty. Start adding books!</p>
                        <button className='w-fit px-4 py-1 bg-sky-300 rounded-lg' onClick={NvBtn}>GO & Add</button>
                    </div>
                )}
            </div>
        </>
    );
}

