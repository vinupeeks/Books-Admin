import axios from "axios";
import {
    onRequest,
    onRequestError,
    onResponse,
    onResponseError,
} from "./api-interceptors.jsx";


const BASE_URL = import.meta.env.VITE_BASE_URL;

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
