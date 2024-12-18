import { jwtDecode } from "jwt-decode";


export const getAuthToken = () => {
    return localStorage.getItem('BooksAdminToken');
};

export const getDecodedTokenId = () => {
    const Token = localStorage.getItem('BooksAdminToken');

    if (Token) {
        try {
            const decodedToken = jwtDecode(Token);
            let ID = null;
            return ID = decodedToken.id;
        } catch (error) {
            console.error('Error decoding token', error);
        }
    }
};