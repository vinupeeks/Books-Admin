
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
 

const membershipsQueries = {
    membershipListMutation,
    membershipByIdMutation
};

export default membershipsQueries;
