"use server";

import { Post } from "../../../types/globalTypes";
import { apiClient } from "../lib/apiClient";

export const fetchPosts = async (
  pageNo: number
): Promise<{ posts: Post[]; totalPosts: number }> => {
  try {
    const response = await apiClient.get(
      `/api/post/fetch-posts?pageNo=${pageNo}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    throw new Error(error?.response?.data?.error ?? "Failed to fetch posts");
  }
};

export const likePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/api/like/post?postId=${postId}`);
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while liking post.",
    };
  }
};

export const savePost = async (postId: string) => {
  try {
    const response = await apiClient.post(
      `/api/post/save-post?postId=${postId}`
    );
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while saving post.",
    };
  }
};

export const addComment = async (postId: string, text: string) => {
  try {
    const response = await apiClient.post(
      `/api/comment/create?postId=${postId}`,
      {
        text,
      }
    );
    return { success: true, comment: response.data.comment };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while creating comment.",
    };
  }
};
