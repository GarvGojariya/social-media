"use server";
import axios from "axios";
import { cookies, headers } from "next/headers";

const getBaseURL = () => {
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
};

const getCookieString = () => {
  const cookieStore = cookies();
  return cookieStore.getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join("; ");
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  if (typeof window === "undefined") { // Only set cookies in SSR
    config.headers["Cookie"] = getCookieString();
  }
  return config;
}, error => Promise.reject(error));
