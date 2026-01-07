import axios from "axios";

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,   // <--- REQUIRED FOR RENDER
});


// 🔐 ALWAYS attach token BEFORE request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("pf_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚪 Auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pf_token");
      localStorage.removeItem("pf_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
