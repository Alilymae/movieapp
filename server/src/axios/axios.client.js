import axios from "axios";

// TMDB AXIOS CLIENT
console.log("Axios Client - TMDB_BASE_URL:", process.env.TMDB_BASE_URL);
console.log("Axios Client - TMDB_KEY:", process.env.TMDB_KEY ? "✓ Loaded" : "✗ Not loaded");

const axiosClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_KEY
  }
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  (config) => {
    console.log("TMDB API Request:", {
      url: config.baseURL + config.url,
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error("TMDB Request Error:", error.message);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("TMDB API Response - Status:", response.status);
    return response.data;
  },
  (error) => {
    console.error("TMDB API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: error.config?.url
    });
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Unknown TMDB API error";
    return Promise.reject(new Error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage)));
  }
);

export default axiosClient;
