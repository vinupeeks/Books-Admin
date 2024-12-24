import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx';
import { selectAuthToken } from '../redux/reducers/authReducers.js';
import { store } from '../redux/store.js';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const Token = getAuthToken();


const booksService = {

    bookslist: async (params = '') => {
        const Token = selectAuthToken(store.getState())
        return apiRequest({
            method: "GET",
            url: `${RouteConstants.BOOKS}?${params}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    booksAdd: async (book) => {
        const Token = selectAuthToken(store.getState())
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
        const Token = selectAuthToken(store.getState())
        return apiRequest({
            method: "GET",
            url: `${RouteConstants.BOOKS}/${id}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    bookDeleteById: async (id = '') => {
        const Token = selectAuthToken(store.getState())
        return apiRequest({
            method: "DELETE",
            url: `${RouteConstants.BOOKS}/${id}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    bookEditById: async (book) => {
        const Token = selectAuthToken(store.getState())
        return apiRequest({
            method: "PUT",
            url: `${RouteConstants.BOOKS}/${book.id}`,
            headers: {
                Authorization: "Bearer " + Token
            },
            data: book,
        });
    },

    Lastbookslist: async (book) => {
        const Token = selectAuthToken(store.getState())
        const search = book?.text ? book.text : '';
        return apiRequest({
            method: "GET",
            url: `${RouteConstants.BOOKSLAST}?search=${search}`,
            headers: {
                Authorization: "Bearer " + Token
            },
            // data: book,
        });
    },

    BookIssueSubmit: async (book) => {
        const Token = selectAuthToken(store.getState())
        return apiRequest({
            method: "POST",
            url: `${RouteConstants.BOOK_ISSUE_API}`,
            headers: {
                Authorization: "Bearer " + Token
            },
            data: book,
        });
    },

    BookIssueReturn: async (book) => {
        const Token = selectAuthToken(store.getState())
        const issueId = book.returnBookID;

        return apiRequest({
            method: "PUT",
            url: `${RouteConstants.BOOK_RETURN_API}/${issueId}`,
            headers: {
                Authorization: "Bearer " + Token
            },
        });
    },
}

export default booksService;
