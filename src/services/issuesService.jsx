import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken, getDecodedTokenId } from '../utils/TokenHelper.jsx';
import { selectAuthToken } from '../redux/reducers/authReducers.js';
import { store } from '../redux/store.js';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const TokenId = getDecodedTokenId();

const issuesService = {
    // IssuedList: async () => {
    //     const Token = selectAuthToken(store.getState())
    //     return apiRequest({
    //         method: "GET",
    //         url: `/issues/active`,
    //         headers: {
    //             Authorization: "Bearer " + Token
    //         }
    //     });
    // },

    IssuedList: async (params = '') => {
        const Token = selectAuthToken(store.getState())
        return apiRequest({
            method: "GET",
            url: `/issues/active?${params}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },
}

export default issuesService;
