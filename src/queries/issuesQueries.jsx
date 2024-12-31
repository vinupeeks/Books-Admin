
import { useMutation } from "react-query";
import issuesService from "../services/issuesService.jsx";


const issuedListMutation = (onissuedListSuccess, onErrorCallback) => {

    return useMutation(issuesService.IssuedList, {
        onSuccess: (data) => {
            onissuedListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const issuesQueries = {
    issuedListMutation,
};

export default issuesQueries;
