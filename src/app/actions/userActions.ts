"use server";

import { apiClient } from "../lib/apiClient";

export const searchUser = async (searchTerm: string) => {
  try {
    const response = await apiClient.post(
      `/api/user/get-all?searchTerm=${searchTerm}`
    );
    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message,
      };
    }
    return {
      success: true,
      users: response.data.users,
      message: response.data.message,
    };
  } catch (error) {
    console.log("🚀 ~ searchUser ~ error:", error);
    return {
      success: false,
      message: "Something went wrong while searching user.",
    };
  }
};
