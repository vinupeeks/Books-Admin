import { jwtDecode } from "jwt-decode";
import { selectAuthToken } from "../redux/reducers/authReducers";
import { store } from "../redux/store";


export const getAuthToken = () => {
    // return localStorage.getItem('BooksAdminToken');
    return selectAuthToken(store.getState())
};

export const getDecodedTokenId = () => {
    // const Token = localStorage.getItem('BooksAdminToken');
    const Token = selectAuthToken(store.getState())
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

export const getDecodedToken = () => {
    const token = getAuthToken();
    if (token) {
        try {
            const decodedToken = jwtDecode(token); 
            return decodedToken; 
        } catch (error) {
            console.error("Error decoding token", error);
        }
    }
    return null;
};