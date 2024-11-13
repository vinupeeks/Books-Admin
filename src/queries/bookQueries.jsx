
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

const bookQueries = {
    booksListMutation,
    booksAddMutation,
    bookByIdMutation,
    bookDeleteByIdMutation
};

export default bookQueries;
