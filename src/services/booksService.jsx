import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const Token = getAuthToken();


const booksService = {

    bookslist: async () => {
        return apiRequest({
            method: "GET",
            url: `${RouteConstants.BOOKS}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    booksAdd: async (book) => {
        return apiRequest({
            method: "POST",
            url: `${RouteConstants.BOOKS}`,
            headers: {
                Authorization: "Bearer " + Token
            },
            data: book,
        });
    },

    bookGetById: async (id) => {
        return apiRequest({
            method: "GET",
            url: `${RouteConstants.BOOKID.replace(':id', id)}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    bookDeleteById: async (id = '') => {
        return apiRequest({
            method: "DELETE",
            url: `${RouteConstants.BOOKID.replace(':id', id)}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    bookEditById: async (book) => {
        return apiRequest({
            method: "PUT",
            url: `${RouteConstants.BOOKID.replace(':id', book.id)}`,
            headers: {
                Authorization: "Bearer " + Token
            },
            data: book,
        });
    },
}

export default booksService;
