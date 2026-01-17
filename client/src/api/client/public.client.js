// PUBLIC CLIENT
import axios from "axios";
import queryString from "query-string";

const baseURL = "http://localhost:5000/api/v1";

const publicClient = axios.create({
    baseURL,
    paramsSerializer: {
        serialize: params => queryString.stringify(params)
    }
});

// REQUEST INTERCEPTOR
publicClient.interceptors.request.use(async config => {
    return {
        ...config,
        headers: {
            "Content-Type": "application/json"
        }
    };
});
// RESPONSE INTERCEPTOR
publicClient.interceptors.response.use((response) => {
    if (response && response.data) return response.data;
    return response;
}, (err) => {
    throw err.response.data;
});

export default publicClient;
// IHTSM