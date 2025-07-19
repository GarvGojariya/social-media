"use client";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Collapse,
  Chip,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Comment, Post } from "../../../types/globalTypes";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import toast from "react-hot-toast";
import { API } from "../lib/axios";
import CommentSkeleton from "./CommentSkeleton";
import CommentCard from "./CommentCard";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import { getDateTimeFromNow } from "../../../utils/globalHelpers/globalHelpers";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const PostCard = ({ postData }: { postData: Post }) => {
  const [loading, setLoading] = useState(true);
  const [commentsData, setCommentsData] = useState<Comment[]>([]);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [addCommentLoading, setAddCommentLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(postData.isLiked);
  const [isSaved, setIsSaved] = useState<boolean>(postData.isSaved);
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [likeCount, setLikeCount] = useState<number>(postData._count.likes);
  const [commentCount, setCommentCount] = useState<number>(
    postData._count.comments
  );
  const [commentPageNo, setCommentPageNo] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const router = useRouter();

  const ExpandMore = styled((props: any) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const getPostComents = async () => {
    try {
      const response = await API.get(
        `/api/post/get-comments?postId=${postData.id}&pageNo=${commentPageNo}`
      );
      setCommentsData(response.data?.comments);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.error ??
          "Something went wrong while fetching comments."
      );
      setLoading(false);
    }
  };

  const fetchMoreComments = async () => {
    try {
      const response = await API.get(
        `/api/post/get-comments?postId=${postData.id}&pageNo=${
          commentPageNo + 1
        }`
      );
      if (response.data?.comments.length == 0) {
        setHasMore(false);
      }
      setCommentsData([...commentsData, ...response.data?.comments]);
      setCommentPageNo(commentPageNo + 1);
      // setLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.error ??
          "Something went wrong while fetching comments."
      );
      // setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      setAddCommentLoading(true);
      const response = await API.post(
        `/api/comment/create?postId=${postData.id}`,
        { text: commentText }
      );
      setCommentsData([response.data.comment, ...commentsData]);
      // await getPostComents()
      setCommentText("");
      setAddCommentLoading(false);
      setCommentCount(commentCount + 1);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.error ??
          "Something went wrong while creating comment."
      );
      setAddCommentLoading(false);
    }
  };

  const togglePostLike = async () => {
    try {
      const response = await API.post(`/api/like/post?postId=${postData.id}`);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      toast.success(response.data?.message);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.error ??
          "Something went wrong while liking post."
      );
    }
  };

  const toggleSavePost = async () => {
    try {
      const response = await API.post(
        `/api/post/save-post?postId=${postData.id}`
      );
      setIsSaved(!isSaved);
      toast.success(response.data?.message);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.error ??
          "Something went wrong while saving post."
      );
    }
  };

  const handleLikeToggle = (id: string, isLiked: boolean, likes: number) => {
    setCommentsData((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id
          ? { ...comment, isLiked, _count: { ...comment._count, likes } }
          : comment
      )
    );
  };

  useEffect(() => {
    if (isCommentBoxOpen) {
      getPostComents();
    }
  }, [isCommentBoxOpen]);

  useEffect(() => {
    if (postData && postData.createdAt) {
      const tAgo = getDateTimeFromNow(postData.createdAt);
      setTimeAgo(tAgo);
    }
  }, [postData]);

  return (
    <Card 
      sx={{ 
        maxWidth: 600, 
        mx: 'auto',
        mb: 3,
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar 
            src={postData.owner.profileImage} 
            alt={postData.owner.userName}
            sx={{ width: 48, height: 48 }}
          />
        }
        title={
          <Button
            variant="text"
            onClick={() => router.push(`/profile/${postData.ownerId}`)}
            sx={{ 
              p: 0, 
              minWidth: 'auto',
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            {postData.owner.userName}
          </Button>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {timeAgo}
          </Typography>
        }
        sx={{ pb: 1 }}
      />
      
      <CardMedia
        component="img"
        image={postData.url}
        alt="Post content"
        sx={{
          maxHeight: 600,
          objectFit: 'cover',
        }}
      />
      
      <CardActions disableSpacing sx={{ px: 2, py: 1 }}>
        <IconButton 
          onClick={togglePostLike}
          sx={{
            color: isLiked ? 'error.main' : 'action.default',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          {isLiked ? (
            <FavoriteRoundedIcon />
          ) : (
            <FavoriteBorderRoundedIcon />
          )}
        </IconButton>
        
        <IconButton 
          onClick={() => setIsCommentBoxOpen(!isCommentBoxOpen)}
          sx={{
            color: isCommentBoxOpen ? 'primary.main' : 'action.default',
          }}
        >
          <MapsUgcRoundedIcon />
        </IconButton>
        
        <IconButton 
          onClick={toggleSavePost}
          sx={{
            color: isSaved ? 'warning.main' : 'action.default',
            ml: 'auto',
          }}
        >
          {isSaved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
        </IconButton>
      </CardActions>
      
      <CardContent sx={{ pt: 0 }}>
        {likeCount > 0 && (
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {likeCount} {likeCount > 1 ? "likes" : "like"}
          </Typography>
        )}
        
        {postData.caption && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 600, mr: 1 }}>
              {postData.owner.userName}
            </Typography>
            <Typography variant="body2" component="span">
              {postData.caption}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <TextField
            placeholder="Add a comment..."
            variant="outlined"
            size="small"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={addCommentLoading}
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <Button
            variant="contained"
            size="small"
            disabled={addCommentLoading || !commentText.trim()}
            onClick={handleCommentSubmit}
            sx={{ 
              minWidth: 80,
              borderRadius: 3,
            }}
          >
            Post
          </Button>
        </Box>
      </CardContent>
      
      <Collapse in={isCommentBoxOpen} timeout="auto" unmountOnExit>
        <Divider />
        <Box
          sx={{ 
            maxHeight: 400, 
            overflowY: "auto",
            bgcolor: 'grey.50',
          }}
          id="comments-box"
        >
          {loading && (
            <Box sx={{ p: 2 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <CommentSkeleton key={index} />
              ))}
            </Box>
          )}
          
          {!loading && commentsData.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            </Box>
          )}
          
          {!loading && commentsData.length > 0 && (
            <InfiniteScroll
              endMessage={
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    You've seen all comments
                  </Typography>
                </Box>
              }
              scrollableTarget="comments-box"
              dataLength={commentsData.length}
              next={fetchMoreComments}
              hasMore={hasMore}
              loader={<CommentSkeleton />}
            >
              {commentsData.map((comment) => (
                <CommentCard
                  key={comment.id}
                  postOwnerId={postData.ownerId}
                  commentData={comment}
                  onLikeToggle={handleLikeToggle}
                />
              ))}
            </InfiniteScroll>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

PostCard.displayName = "PostCard";

export default PostCard;
