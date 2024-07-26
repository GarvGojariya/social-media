"use client"
import React, { useState } from 'react';
import { Comment } from '../../../types/globalTypes';
import { Avatar, Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { API } from '../lib/axios';
import toast from 'react-hot-toast';

const CommentCard = ({ commentData, onLikeToggle }: { commentData: Comment, onLikeToggle: (id: string, isLiked: boolean, likes: number) => void }) => {

    const [isLiked, setIsLiked] = useState<boolean>(commentData.isLiked);
    const [likeCount, setLikeCount] = useState<number>(commentData._count.likes);

    const toggleCommentLike = async () => {
        try {
            setIsLiked(!isLiked);
            const response = await API.post(`/api/like/comment?commentId=${commentData.id}`);
            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
            onLikeToggle(commentData.id, !isLiked, isLiked ? likeCount - 1 : likeCount + 1);
            toast.success(response.data?.message);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error ?? "Something went wrong while liking comment.");
        }
    };

    return (
        <Paper elevation={1} sx={{ padding: "8px", marginY: "4px" }}>
            <Grid container spacing={2}>
                <Grid item>
                    <Avatar src={commentData.owner.profileImage} alt={commentData.owner.userName} />
                </Grid>
                <Grid item xs>
                    <Box>
                        <Typography variant="body2"><strong>{commentData.owner.userName}</strong></Typography>
                        <Typography variant="body2">{commentData.text}</Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={toggleCommentLike}>
                            {isLiked ? <FavoriteRoundedIcon sx={{ color: 'red', height: "16px", width: "16px" }} /> : <FavoriteBorderRoundedIcon sx={{ height: "16px", width: "16px" }} />}
                        </IconButton>
                        <Typography variant="body2" sx={{ display: 'inline', marginLeft: "4px" }}>{likeCount}</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default CommentCard;
