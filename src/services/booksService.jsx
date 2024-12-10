import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const Token = getAuthToken();


const booksService = {

    bookslist: async (params = '') => {
        return apiRequest({
            method: "GET",
            url: `${RouteConstants.BOOKS}?${params}`,
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
            url: `${RouteConstants.BOOKS}/${id}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    bookDeleteById: async (id = '') => {
        return apiRequest({
            method: "DELETE",
            url: `${RouteConstants.BOOKS}/${id}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    bookEditById: async (book) => {
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
