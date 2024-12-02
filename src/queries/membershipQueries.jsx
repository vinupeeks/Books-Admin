
import { useMutation } from "react-query";
import membershipService from "../services/membershipService.jsx";


const membershipListMutation = (onmembershipListSuccess, onErrorCallback) => {

    return useMutation(membershipService.membershipslist, {
        onSuccess: (data) => {
            onmembershipListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const membershipByIdMutation = (onmembershipListSuccess, onErrorCallback) => {

    return useMutation(membershipService.membershipById, {
        onSuccess: (data) => {
            onmembershipListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const memberBookDetailsMutation = (onmembershipListSuccess, onErrorCallback) => {

    return useMutation(membershipService.memberBookDetails, {
        onSuccess: (data) => {
            onmembershipListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const membershipsQueries = {
    membershipListMutation,
    membershipByIdMutation,
    memberBookDetailsMutation
};

export default membershipsQueries;
