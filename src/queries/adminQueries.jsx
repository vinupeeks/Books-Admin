
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


const bookQueries = {
    adminLoginMutation,
};

export default bookQueries;
