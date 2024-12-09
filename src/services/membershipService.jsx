import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const Token = getAuthToken();


const membershipService = {

    familyMembershipList: async (search) => {

        const filter = search;
        return apiRequest({
            method: "POST",
            url: `/membership/details`,
            headers: {
                Authorization: "Bearer " + Token,
            },
            data: filter,
        });
    },

    membershipslist: async (search) => {

        const filter = search;
        return apiRequest({
            method: "POST",
            url: `/members/list`,
            headers: {
                Authorization: "Bearer " + Token,
            },
            data: filter,
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
    memberBookDetails: async (id) => {
        const memberId = id;

        return apiRequest({
            method: "POST",
            url: `${RouteConstants.MEMBER_BOOK_ISSUE_DETAILS}`,
            headers: {
                Authorization: "Bearer " + Token
            },
            data: { memberId },
        });
    },
}

export default membershipService;
