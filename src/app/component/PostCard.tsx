"use client"
import { Box, Grid, Paper, Typography, Avatar, TextField, Button, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Comment, Post } from '../../../types/globalTypes';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import toast from 'react-hot-toast';
import { API } from '../lib/axios';
import CommentSkeleton from './CommentSkeleton';
import CommentCard from './CommentCard';
import MapsUgcRoundedIcon from '@mui/icons-material/MapsUgcRounded';
import { getDateTimeFromNow } from '../../../utils/globalHelpers/globalHelpers';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

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
    const [commentCount, setCommentCount] = useState<number>(postData._count.comments);
    const [commentPageNo, setCommentPageNo] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true)

    const router = useRouter();

    const getPostComents = async () => {
        try {
            const response = await API.get(`/api/post/get-comments?postId=${postData.id}&pageNo=${commentPageNo}`);
            setCommentsData(response.data?.comments);
            setLoading(false);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error ?? "Something went wrong while fetching comments.");
            setLoading(false);
        }
    };

    const fetchMoreComments = async () => {
        try {
            const response = await API.get(`/api/post/get-comments?postId=${postData.id}&pageNo=${commentPageNo + 1}`);
            if (response.data?.comments.length == 0) {
                setHasMore(false)
            }
            setCommentsData([
                ...commentsData,
                ...response.data?.comments
            ]);
            setCommentPageNo(commentPageNo + 1)
            // setLoading(false);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error ?? "Something went wrong while fetching comments.");
            // setLoading(false);
        }
    }

    const handleCommentSubmit = async () => {
        try {
            setAddCommentLoading(true);
            const response = await API.post(`/api/comment/create?postId=${postData.id}`, { text: commentText });
            setCommentsData([response.data.comment, ...commentsData]);
            // await getPostComents()
            setCommentText("");
            setAddCommentLoading(false);
            setCommentCount(commentCount + 1);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error ?? "Something went wrong while creating comment.");
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
            toast.error(error?.response?.data?.error ?? "Something went wrong while liking post.");
        }
    };

    const toggleSavePost = async () => {
        try {
            const response = await API.post(`/api/post/save-post?postId=${postData.id}`);
            setIsSaved(!isSaved);
            toast.success(response.data?.message);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error ?? "Something went wrong while saving post.");
        }
    };

    const handleLikeToggle = (id: string, isLiked: boolean, likes: number) => {
        setCommentsData((prevComments) =>
            prevComments.map((comment) =>
                comment.id === id ? { ...comment, isLiked, _count: { ...comment._count, likes } } : comment
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
        <Paper elevation={3} sx={{ maxWidth: "650px" }}>
            <Grid container>
                <Grid item>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: "center", padding: "8px" }}>
                            <Avatar sx={{ height: "30px", width: "30px" }} variant="circular" src={postData.owner.profileImage} alt="" />
                            <Button
                                sx={{ fontSize: "14px", color: "black", textTransform: "capitalize ", "&:hover": { bgcolor: "unset" } }}
                                variant='text'
                                onClick={() => router.push(`/profile/${postData.ownerId}`)}
                            >
                                {postData.owner.userName}
                            </Button>
                            <Typography sx={{ fontSize: "14px" }}>{timeAgo}</Typography>
                        </Box>
                        <img src={postData.url} alt={"post"} style={{ width: '100%' }} loading='lazy' />
                        <Box sx={{ display: 'flex' }}>
                            <Box>
                                <IconButton onClick={togglePostLike}>
                                    {isLiked ?
                                        <FavoriteRoundedIcon sx={{ color: 'red', height: "24px", width: "24px" }} />
                                        :
                                        <FavoriteBorderRoundedIcon sx={{ height: "24px", width: "24px", color: "black" }} />
                                    }
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton onClick={() => setIsCommentBoxOpen(!isCommentBoxOpen)}>
                                    <MapsUgcRoundedIcon sx={{ height: "24px", width: "24px", color: "black" }} />
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton onClick={toggleSavePost}>
                                    {isSaved ? <BookmarkRoundedIcon sx={{ height: "24px", width: "24px", color: "black" }} /> : <BookmarkBorderRoundedIcon sx={{ height: "24px", width: "24px", color: "black" }} />}
                                </IconButton>
                            </Box>
                        </Box>
                        <Box sx={{ paddingX: "12px", paddingBottom: "12px" }}>
                            {likeCount > 0 && <Typography>{likeCount} {likeCount > 1 ? "Likes" : "Like"}</Typography>}
                            {postData.caption.length > 0 && <Box sx={{ display: 'flex', alignItems: "center", gap: "12px" }}>
                                <Avatar sx={{ height: "30px", width: "30px" }} variant="circular" src={postData.owner.profileImage} alt="" />
                                <Typography sx={{ fontSize: "14px" }}>{postData.caption}</Typography>
                            </Box>}
                            <Box sx={{ display: 'flex', alignItems: "center", gap: "12px" }}>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Comment"
                                    multiline
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    style={{ width: "100%" }}
                                    disabled={addCommentLoading}
                                    variant='standard'
                                />
                                <Button
                                    disabled={addCommentLoading}
                                    onClick={handleCommentSubmit}
                                    variant="contained"
                                    style={{ color: "white", backgroundColor: "black", borderRadius: "12px" }}
                                >
                                    Post
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    {isCommentBoxOpen && <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
                        {loading && Array.from({ length: 4 }).map((_, index) => (
                            <CommentSkeleton key={index} />
                        ))}
                        {!loading && commentsData.length === 0 && <Typography sx={{
                            textAlign: "center",
                            p: "14px"
                        }}>No comments yet!</Typography>}
                        {!loading && commentsData.length > 0 &&
                            <InfiniteScroll
                                endMessage={<Typography sx={{
                                    textAlign: "center",
                                    p: "14px"
                                }}>You have all caught!</Typography>}
                                height={450}
                                dataLength={commentsData.length}
                                next={fetchMoreComments}
                                hasMore={hasMore}
                                loader={<CommentSkeleton />}
                            >
                                {commentsData.map((comment) => (
                                    <CommentCard key={comment.id} commentData={comment} onLikeToggle={handleLikeToggle} />
                                ))}
                            </InfiniteScroll>}
                    </Box>}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default PostCard;
