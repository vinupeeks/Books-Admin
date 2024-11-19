import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const Token = getAuthToken();


const membershipService = {

    membershipslist: async (id) => {
        return apiRequest({
            method: "GET",
            url: `${RouteConstants.MEMBER_SHIP.replace(':id', id)}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    membershipById: async (id) => {
        return apiRequest({
            method: "GET",
            url: `${RouteConstants.MEMBER_SHIP_BY_ID.replace(':id', id)}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },
}

export default membershipService;
