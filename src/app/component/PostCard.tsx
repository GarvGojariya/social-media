"use client";

import React, { useState, useRef, useTransition } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Drawer,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import toast from "react-hot-toast";
import useSWRInfinite from "swr/infinite";
import CommentSkeleton from "./CommentSkeleton";
import CommentCard from "./CommentCard";
import { getDateTimeFromNow } from "../../../utils/globalHelpers/globalHelpers";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageNotfound } from "@/assets/images";
import { Comment, Post } from "../../../types/globalTypes";
import { addComment, likePost, savePost } from "../actions/postActions";
import { Puller } from "./Puller";
import { LoadingButton } from "@mui/lab";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    const errorData = await res.json();
    (error as any).info = errorData;
    throw error;
  }
  return res.json();
};

const PostCard = ({ postData }: { postData: Post }) => {
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState<boolean>(postData.isLiked);
  const [isSaved, setIsSaved] = useState<boolean>(postData.isSaved);
  const [likeCount, setLikeCount] = useState<number>(postData._count.likes);
  const [commentCount, setCommentCount] = useState<number>(
    postData._count.comments
  );
  const [timeAgo, setTimeAgo] = useState<string>(
    getDateTimeFromNow(postData.createdAt)
  );
  const commentInputRef = useRef<HTMLInputElement>(null);

  const PAGE_SIZE = 10;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!isCommentBoxOpen) return null; // Don't fetch if drawer is closed
    if (previousPageData && !previousPageData.comments.length) return null; // Reached the end
    return `/api/post/get-comments?postId=${postData.id}&pageNo=${
      pageIndex + 1
    }&limit=${PAGE_SIZE}`;
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const loading = !data && isCommentBoxOpen;
  const hasMore = data
    ? data[data.length - 1]?.comments.length === PAGE_SIZE
    : true;
  const commentsData = data ? data.flatMap((page) => page.comments) : [];

  const router = useRouter();

  const togglePostLike = () => {
    startTransition(async () => {
      const prevLikeState = isLiked;
      // Optimistic update
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

      const result = await likePost(postData.id);

      if (!result.success) {
        // Revert on failure
        setIsLiked(prevLikeState);
        setLikeCount(prevLikeState ? likeCount : likeCount - 1);
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  };

  const toggleSavePost = () => {
    startTransition(async () => {
      const prevSaveState = isSaved;
      // Optimistic update
      setIsSaved(!isSaved);

      const result = await savePost(postData.id);

      if (!result.success) {
        // Revert on failure
        setIsSaved(prevSaveState);
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    startTransition(async () => {
      const result = await addComment(postData.id, commentText);

      if (result.success) {
        // Update local state and SWR cache
        setCommentText("");
        setCommentCount(commentCount + 1);
        mutate(
          (data: any) => {
            if (!data) return [[{ comments: [result.comment] }]];
            const newData = [...data];
            newData[0] = {
              ...newData[0],
              comments: [result.comment, ...newData[0].comments],
            };
            return newData;
          },
          { revalidate: false }
        );
      } else {
        toast.error(
          result.message || "Something went wrong while adding comment."
        );
      }
    });
  };

  const handleLikeToggle = (id: string, isLiked: boolean, likes: number) => {
    mutate(
      (data: any) => {
        if (!data) return data;
        return data.map((page: any) => ({
          ...page,
          comments: page.comments.map((comment: Comment) =>
            comment.id === id
              ? { ...comment, isLiked, _count: { ...comment._count, likes } }
              : comment
          ),
        }));
      },
      { revalidate: false }
    );
  };

  const handleCloseComments = () => {
    setIsCommentBoxOpen(false);
  };

  return (
    <Box sx={{ bgcolor: "transparent", boxShadow: "unset" }}>
      <Grid
        container
        sx={{
          justifyContent: "center",
        }}
      >
        <Grid
          item
          sx={{
            bgcolor: "white",
            width: "100%",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", padding: "8px" }}>
              <Avatar
                sx={{ height: "30px", width: "30px" }}
                variant="circular"
                src={postData.owner.profileImage}
                alt=""
              />
              <Button
                sx={{
                  fontSize: "14px",
                  color: "black",
                  textTransform: "capitalize",
                  "&:hover": { bgcolor: "unset" },
                }}
                variant="text"
                onClick={() => router.push(`/profile/${postData.ownerId}`)}
              >
                {postData.owner.userName}
              </Button>
              <Typography sx={{ fontSize: "14px" }}>{timeAgo}</Typography>
            </Box>
            <Image
              src={postData.url}
              alt={"post"}
              loading="lazy"
              width={500}
              height={500}
              placeholder="blur"
              blurDataURL={ImageNotfound.src}
              style={{ objectFit: "contain", width: "100%" }}
            />
            <Box sx={{ display: "flex" }}>
              <Box>
                <IconButton onClick={togglePostLike} disabled={isPending}>
                  {isLiked ? (
                    <FavoriteRoundedIcon
                      sx={{ color: "red", height: "24px", width: "24px" }}
                    />
                  ) : (
                    <FavoriteBorderRoundedIcon
                      sx={{ height: "24px", width: "24px", color: "black" }}
                    />
                  )}
                </IconButton>
              </Box>
              <Box>
                <IconButton onClick={() => setIsCommentBoxOpen(true)}>
                  <MapsUgcRoundedIcon
                    sx={{ height: "24px", width: "24px", color: "black" }}
                  />
                </IconButton>
              </Box>
              <Box>
                <IconButton onClick={toggleSavePost} disabled={isPending}>
                  {isSaved ? (
                    <BookmarkRoundedIcon
                      sx={{ height: "24px", width: "24px", color: "black" }}
                    />
                  ) : (
                    <BookmarkBorderRoundedIcon
                      sx={{ height: "24px", width: "24px", color: "black" }}
                    />
                  )}
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ paddingX: "12px", paddingBottom: "12px" }}>
              {likeCount > 0 && (
                <Typography>
                  {likeCount} {likeCount > 1 ? "Likes" : "Like"}
                </Typography>
              )}
              {postData.caption.length > 0 && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Avatar
                    sx={{ height: "30px", width: "30px" }}
                    variant="circular"
                    src={postData.owner.profileImage}
                    alt=""
                  />
                  <Typography sx={{ fontSize: "14px" }}>
                    {postData.caption}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Instagram-style Comments Drawer */}
          <Drawer
            anchor="bottom"
            open={isCommentBoxOpen}
            onClose={handleCloseComments}
            PaperProps={{
              sx: {
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                maxHeight: "70vh",
                maxWidth: "576px",
                margin: "0 auto",
              },
            }}
          >
            <Puller />
            <Typography
              variant="h6"
              sx={{ p: 2, textAlign: "center", borderBottom: "1px solid #eee" }}
            >
              Comments
            </Typography>

            <Box sx={{ height: "calc(70vh - 170px)", overflow: "auto", p: 2 }}>
              {loading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <CommentSkeleton key={index} />
                ))}

              {error && (
                <Typography
                  sx={{ textAlign: "center", color: "error.main", p: 2 }}
                >
                  Failed to load comments
                </Typography>
              )}

              {!loading && commentsData.length === 0 && (
                <Typography sx={{ textAlign: "center", p: 2 }}>
                  No comments yet!
                </Typography>
              )}

              {commentsData.map((comment) => (
                <CommentCard
                  key={comment.id}
                  postOwnerId={postData.ownerId}
                  commentData={comment}
                  onLikeToggle={handleLikeToggle}
                />
              ))}

              {hasMore && !loading && commentsData.length > 0 && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => setSize(size + 1)}
                  sx={{ mt: 2 }}
                >
                  Load more comments
                </Button>
              )}
            </Box>

            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderTop: "1px solid #eee",
                position: "sticky",
                bottom: 0,
                bgcolor: "white",
              }}
            >
              <TextField
                id="comment-input"
                placeholder="Add a comment..."
                inputRef={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                disabled={isPending}
              />
              <LoadingButton
                disabled={isPending || !commentText.trim()}
                onClick={handleCommentSubmit}
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "black",
                  borderRadius: "12px",
                  "&:disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
                loading={isPending}
              >
                Post
              </LoadingButton>
            </Box>
          </Drawer>
        </Grid>
      </Grid>
    </Box>
  );
};

PostCard.displayName = "PostCard";

export default PostCard;
