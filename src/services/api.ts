import axios, { AxiosError } from "axios";
import { refreshTokens } from "./User"; // lowercase file name

const api = axios.create({
  baseURL: "https://sf-be.vercel.app/api/v1",
  withCredentials: true, // needed for cookies
});




// PUBLIC ENDPOINTS — no token needed
const PUBLIC_ENDPOINTS = [
  "/user/login",
  "/user/register",
  "/user/otpGenarate",
  "/user/checkOtp",
];

// ----------------------
// REQUEST INTERCEPTOR
// ----------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      config.url?.includes(url)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------
// RESPONSE INTERCEPTOR
// ----------------------

//---------------------------------------------------------------------
//INTERCEPTER -----> 
//Intercepter is mean as like the Middleware 
//They can catch the reponse and request before send and came inside 

//REQUEST INTERCEPTER ---> 
//runs before the requests leave from frontend

//RESPONSE INTERCEPTER --->
//runs after the server responds.
//---------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      originalRequest?.url?.includes(url)
    );

    // Handle 401 (token expired)
    if (
      error.response?.status === 401 &&
      !isPublic &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Get new access token
        const res = await refreshTokens(refreshToken);

        localStorage.setItem("accessToken", res.accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh token failed → logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
