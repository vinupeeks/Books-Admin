
import { useMutation } from "react-query";
import adminService from "../services/adminService.jsx";


const adminLoginMutation = (onAdminLoginSuccess, onErrorCallback) => {

    return useMutation(adminService.adminLogin, {
        onSuccess: (data) => {
            onAdminLoginSuccess(data);
        },
        onError: onErrorCallback,
    });
};
const adminProfileMutation = (onAdminLoginSuccess, onErrorCallback) => {

    return useMutation(adminService.adminProfile, {
        onSuccess: (data) => {
            onAdminLoginSuccess(data);
        },
        onError: onErrorCallback,
    });
};


const adminQueries = {
    adminLoginMutation,
    adminProfileMutation
};

export default adminQueries;
