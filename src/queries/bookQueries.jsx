
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


const bookQueries = {
    booksListMutation,
};

export default bookQueries;
