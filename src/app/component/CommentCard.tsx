"use client";
import React, { useState } from "react";
import { Comment } from "../../../types/globalTypes";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { API } from "../lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CommentCard = ({
  commentData,
  onLikeToggle,
  postOwnerId,
}: {
  commentData: Comment;
  onLikeToggle: (id: string, isLiked: boolean, likes: number) => void;
  postOwnerId?: string;
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(commentData.isLiked);
  const [likeCount, setLikeCount] = useState<number>(commentData._count.likes);

  const router = useRouter();

  const toggleCommentLike = async () => {
    try {
      setIsLiked(!isLiked);
      const response = await API.post(
        `/api/like/comment?commentId=${commentData.id}`
      );
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      onLikeToggle(
        commentData.id,
        !isLiked,
        isLiked ? likeCount - 1 : likeCount + 1
      );
      toast.success(response.data?.message);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.error ??
          "Something went wrong while liking comment."
      );
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        borderRadius: 2,
        border: 'none',
        bgcolor: 'transparent',
        boxShadow: 'none',
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.02)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar
            src={commentData.owner.profileImage}
            alt={commentData.owner.userName}
            sx={{ width: 36, height: 36 }}
          />
          
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ mb: 0.5 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => router.push(`/profile/${commentData.ownerId}`)}
                sx={{
                  p: 0,
                  minWidth: 'auto',
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  '&:hover': { 
                    bgcolor: 'transparent', 
                    textDecoration: 'underline' 
                  },
                }}
              >
                {commentData.owner.userName}
              </Button>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 1, wordBreak: 'break-word' }}>
              {commentData.text}
            </Typography>
            
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconButton 
                size="small" 
                onClick={toggleCommentLike}
                sx={{ 
                  color: isLiked ? 'error.main' : 'action.default',
                  p: 0.5,
                }}
              >
                {isLiked ? (
                  <FavoriteRoundedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <FavoriteBorderRoundedIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
              
              <Typography variant="caption" color="text.secondary">
                {likeCount > 0 && `${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

CommentCard.displayName = "CommentCard";

export default CommentCard;
