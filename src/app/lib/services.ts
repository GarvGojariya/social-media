"use server";
import { cookies, headers } from "next/headers";
import axios from "axios";

export const callInternalApi = async () => {
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const cookieStore = cookies();
  const cookieString = cookieStore.getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await axios.get(`${protocol}://${host}/api/user/get-current-user`, {
      headers: {
        "Cookie": cookieString
      },
    });

    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
