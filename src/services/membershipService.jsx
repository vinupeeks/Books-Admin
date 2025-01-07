import apiRequest from '../apis/api-request.jsx';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from '../utils/TokenHelper.jsx';
import RouteConstants from '../constant/Routeconstant.jsx';
import { selectAuthToken } from '../redux/reducers/authReducers.js';
import { store } from '../redux/store.js';

// import { userStore } from '../store/userStore';
// const accessToken = userStore.getState().user.token;

const Token = getAuthToken();


const membershipService = {

    familyMembershipList: async (search) => {
        const Token = selectAuthToken(store.getState())

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
        const Token = selectAuthToken(store.getState())

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
        const Token = selectAuthToken(store.getState())
        return apiRequest({
            method: "GET",
            url: `${RouteConstants.MEMBER_SHIP_BY_ID.replace(':id', id)}`,
            headers: {
                Authorization: "Bearer " + Token
            }
        });
    },

    memberBookDetails: async (id) => {
        const Token = selectAuthToken(store.getState())
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

    createMmber: async (data) => {
        const Token = selectAuthToken(store.getState())
        const memberData = data;

        return apiRequest({
            method: "POST",
            url: `/membership/creation`,
            headers: {
                Authorization: "Bearer " + Token
            },
            data: memberData,
        });
    },

    editMemberDetails: async (data) => {
        const Token = selectAuthToken(store.getState())
        const memberData = data;
        const MemId = data.memId;

        return apiRequest({
            method: "POST",
            url: `members/updation/${MemId}`,
            headers: {
                Authorization: "Bearer " + Token
            },
            data: memberData,
        });
    },
}

export default membershipService;
