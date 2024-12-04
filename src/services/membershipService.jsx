import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const Token = getAuthToken();


const membershipService = {

    membershipslist: async (search) => {
 
        const memType = search?.membershipType;
        const memID = search?.text; 

        return apiRequest({
            method: "POST",
            // url: `${RouteConstants.MEMBER_SHIP}?${query}`,
            url: `/members/list`,
            headers: {
                Authorization: "Bearer " + Token,
            }, 
            data: { memID, memType },
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
