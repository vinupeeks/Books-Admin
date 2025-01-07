import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken, getDecodedTokenId } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx';
import { selectAuthToken } from '../redux/reducers/authReducers.js';
import { store } from '../redux/store.js';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const TokenId = getDecodedTokenId();

const adminService = {

    adminLogin: async (admin) => {
        return apiRequest({
            method: "POST",
            url: `auth/admin/login`,
            data: admin,
        });
    },

    adminProfile: async () => {
        const TokenId = getDecodedTokenId();
        const Token = selectAuthToken(store.getState())

        return apiRequest({
            method: "GET",
            url: `/admin/${TokenId}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },
    CountsOfBooksAndMembers: async () => {
        const Token = selectAuthToken(store.getState())
        return apiRequest({
            method: "GET",
            url: `/admin/count`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },
}

export default adminService;
