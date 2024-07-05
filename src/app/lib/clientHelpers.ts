// "use server"

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

export const onRequest = async(config: InternalAxiosRequestConfig) => {
    // const cookieStore = cookies();
    // const accessToken = await cookieStore.get("accessToken");
    // const refreshToken = await cookieStore.get("refreshToken")
    // if (!accessToken) {
    //     await axios.post("/api/user/refresh-token");
    // }
    return config;
};

export const onRequestError = (error: AxiosError) => {
    return Promise.reject(error);
};

export const onResponse = (response: AxiosResponse) => {
    if (response.data.status === false) {
        return Promise.reject(response.data);
    }
    return response;
};

export const onResponseError = (error: AxiosError) => {
    return Promise.reject(error);
};