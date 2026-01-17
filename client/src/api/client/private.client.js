// PRIVATE CLIENT
import axios from "axios";
import queryString from "query-string";

// PRIVATE CLIENT
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const privateClient = axios.create({
    baseURL,
    paramsSerializer: {
        encode: params => queryString.stringify(params)
    }
});

// REQUEST INTERCEPTOR 
privateClient.interceptors.request.use(async config => {
    const token = localStorage.getItem("actkn");
    
    return {
        ...config,
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        }
    };
});

// RESPONSE INTERCEPTOR
privateClient.interceptors.response.use((response) => {
    if (response && response.data) return response.data;
    return response;
}, (err) => {
    throw err.response.data;
});

export default privateClient;