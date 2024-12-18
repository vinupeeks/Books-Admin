
import { useMutation } from "react-query";
import booksService from "../services/booksService.jsx";


const booksListMutation = (onbooksListSuccess, onErrorCallback) => {

    return useMutation(booksService.bookslist, {
        onSuccess: (data) => {
            onbooksListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const booksAddMutation = (onbooksListSuccess, onErrorCallback) => {

    return useMutation(booksService.booksAdd, {
        onSuccess: (data) => {
            onbooksListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const bookByIdMutation = (onbooksListSuccess, onErrorCallback) => {

    return useMutation(booksService.bookGetById, {
        onSuccess: (data) => {
            onbooksListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const bookDeleteByIdMutation = (onbooksListSuccess, onErrorCallback) => {

    return useMutation(booksService.bookDeleteById, {
        onSuccess: (data) => {
            onbooksListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const bookEditByIdMutation = (onbooksListSuccess, onErrorCallback) => {

    return useMutation(booksService.bookEditById, {
        onSuccess: (data) => {
            onbooksListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const LastBooksListMutation = (onbooksListSuccess, onErrorCallback) => {

    return useMutation(booksService.Lastbookslist, {
        onSuccess: (data) => {
            onbooksListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const SearchedBooksListMutation = (onbooksListSuccess, onErrorCallback) => {

    return useMutation(booksService.Searchedbookslist, {
        onSuccess: (data) => {
            onbooksListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const BookIssueSubmitMutation = (onbooksListSuccess, onErrorCallback) => {

    return useMutation(booksService.BookIssueSubmit, {
        onSuccess: (data) => {
            onbooksListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const BookIssueReturnMutation = (onbooksListSuccess, onErrorCallback) => {

    return useMutation(booksService.BookIssueReturn, {
        onSuccess: (data) => {
            onbooksListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const bookQueries = {
    booksListMutation,
    booksAddMutation,
    bookByIdMutation,
    bookDeleteByIdMutation,
    bookEditByIdMutation,
    LastBooksListMutation,
    SearchedBooksListMutation,
    BookIssueSubmitMutation,
    BookIssueReturnMutation
};

export default bookQueries;
