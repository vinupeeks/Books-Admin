import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken, getDecodedTokenId } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const TokenId = getDecodedTokenId();
const Token = getAuthToken();

const adminService = {

    adminLogin: async (admin) => {
        return apiRequest({
            method: "POST",
            url: `${RouteConstants.LOGIN}`,
            data: admin,
        });
    },

    adminProfile: async () => {
        return apiRequest({
            method: "GET",
            url: `/admin/${TokenId}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

}

export default adminService;
