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

export const getTokenIsValideOrNot = () => {
    const Token = getAuthToken();

    if (Token) {
        let valide = false;

        try {
            const decodedToken = jwtDecode(Token);

            isAdmin = decodedToken.role;
            if (!isAdmin === 'admin') {
                return;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            isTokenExpired = decodedToken.exp < currentTime;

            if (isTokenExpired) {
                return valide = false;
            }
            return valide = true;

        } catch (error) {
            console.error('Error Valide token', error);
        }
    }
}