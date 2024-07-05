// "use server"
// import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
// import { cookies } from "next/headers";

// const instance = axios.create({
//     baseURL: process.env.API_BASE_URL,
//     timeout: 10000,
// })

// // Request interceptor
// instance.interceptors.request.use(
//     async (config: InternalAxiosRequestConfig) => {
//         const cookieStore = cookies()
//         const accessToken = await cookieStore.get("accessToken")
//         if (!accessToken) {
//             await axios.get("/api/user/refresh-token")
//         }
//         return config;
//     },
//     (error) => {
//         console.log({ error })
//         return Promise.reject(error);
//     }
// );
// export default instance

import axios, { AxiosInstance } from 'axios';
import { onRequest, onRequestError, onResponse, onResponseError } from './clientHelpers';

export function setupInterceptorsTo(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}

const baseURL = process.env.API_BASE_URL;

const instance = setupInterceptorsTo(
    axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
        },
    })
);

export { instance };

export const API = instance;
