import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx'; 

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const Token = getAuthToken();

const adminService = {

    adminLogin: async (admin) => {
        return apiRequest({
            method: "POST",
            url: `${RouteConstants.LOGIN}`,
            data: admin,
        });
    },

}

export default adminService;
