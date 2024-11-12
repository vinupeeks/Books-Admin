import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from '../utils/TokenHelper.jsx';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const Token = getAuthToken();


const booksService = {

    bookslist: async (params = '') => {

        return apiRequest({
            method: "GET",
            url: `/books`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

}

export default booksService;
