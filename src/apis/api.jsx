import axios from "axios";
import {
    onRequest,
    onRequestError,
    onResponse,
    onResponseError,
} from "./api-interceptors.jsx";

export const BASE_URL=`http://localhost:1000`
// export const BASE_URL = `https://njs.solminds.com/library/api`;

const defaultOptions = {
    baseURL: `${BASE_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
};
const instance = axios.create(defaultOptions);
instance.interceptors.request.use(
    (config) => onRequest(config),
    (error) => onRequestError(error)
);
instance.interceptors.response.use(
    (response) => onResponse(response),
    (error) => onResponseError(error)
);
export default instance;
