
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

const familyMembershipListMutation = (onmembershipListSuccess, onErrorCallback) => {

    return useMutation(membershipService.familyMembershipList, {
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
const createMmberMutation = (onmembershipListSuccess, onErrorCallback) => {

    return useMutation(membershipService.createMmber, {
        onSuccess: (data) => {
            onmembershipListSuccess(data);
        },
        onError: onErrorCallback,
    });
};
const editMemberDetailsMutation = (editMemberDetailsSuccess, onErrorCallback) => {

    return useMutation(membershipService.editMemberDetails, {
        onSuccess: (data) => {
            editMemberDetailsSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const getFamilyMembersListMutation = (getFamilyMembersListSuccess, onErrorCallback) => {

    return useMutation(membershipService.getFamilyMembersList, {
        onSuccess: (data) => {
            getFamilyMembersListSuccess(data);
        },
        onError: onErrorCallback,
    });
};

const getFamilyLeadersListMutation = (getFamilyLeadersListSuccess, onErrorCallback) => {

    return useMutation(membershipService.getFamilyLeadersList, {
        onSuccess: (data) => {
            getFamilyLeadersListSuccess(data);
        },
        onError: onErrorCallback,
    });
};
const membershipsQueries = {
    membershipListMutation,
    familyMembershipListMutation,
    membershipByIdMutation,
    memberBookDetailsMutation,
    createMmberMutation,
    editMemberDetailsMutation,
    getFamilyMembersListMutation,
    getFamilyLeadersListMutation
};

export default membershipsQueries;
