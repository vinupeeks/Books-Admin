
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const BookSingleCart = ({ book, onRemove }) => {

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();


    const NavBtn = (id) => {
        navigate(`/books/details/${id}`);
    }

    const RmvBookBtn = async (id) => {
        const confirmRemoval = window.confirm(`Are you sure you want to remove book with ID ${id}?`);
        if (!confirmRemoval) return;

        const Token = localStorage.getItem('BooksAdminToken');
        if (!Token) {
            enqueueSnackbar('You need to log in to remove the book.', { variant: 'warning' });
            navigate('/login');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:1000/cart/${id}`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            });

            if (response.status === 200) {
                onRemove(id);
                enqueueSnackbar(`Book removed successfully!`, { variant: 'success' });
                // window.location.reload();
            } else {
                enqueueSnackbar(`Failed to remove the book. Please try again.`, { variant: 'error' });
            }
        } catch (error) {
            if (error.response) {
                enqueueSnackbar(`Error removing the book: ${error.response.data.message}`, { variant: 'error' });
            } else {
                enqueueSnackbar(`Network error: ${error.message}`, { variant: 'error' });
            }
        }
    };


    return (
        <Card sx={{ minWidth: 100, maxWidth: 750, mb: 2 }}>
            <CardContent>
                <Typography variant="h6">
                    {book.BookTitle}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                    Author: {book.BookAuthor}
                </Typography>
                <Typography variant="body2">
                    Book Status: {book.BookStatus || 'No status available.'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => NavBtn(book.BookId)}>View Details</Button>
                <Button size="small" color="error" onClick={() => RmvBookBtn(book.BookCartId)}>Remove From Cart</Button>
            </CardActions>
        </Card>
    );
};

export default BookSingleCart; 
