import axios from "axios";

const ACCOUNT_KEY = "refine-account";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:3001",
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const accountInfoAsStr = localStorage.getItem(ACCOUNT_KEY) || "";
        const accountInfo = JSON.parse(accountInfoAsStr);

        config.headers.Authorization = `Bearer ${accountInfo.accessToken}`;
      } catch {
        // console.error
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
