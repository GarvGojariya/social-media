"use client"
import React, { useState } from 'react';
import { Comment } from '../../../types/globalTypes';
import { Avatar, Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { API } from '../lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CommentCard = ({ commentData, onLikeToggle, postOwnerId }: { commentData: Comment, onLikeToggle: (id: string, isLiked: boolean, likes: number) => void, postOwnerId?: string }) => {

    const [isLiked, setIsLiked] = useState<boolean>(commentData.isLiked);
    const [likeCount, setLikeCount] = useState<number>(commentData._count.likes);

    const router = useRouter()

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
        <Paper elevation={1} sx={{
            padding: "8px", marginY: "4px", boxShadow: "unset", "&:not(:last-child)": {
                borderBottom: "1px solid #ccc"
            },
            borderRadius: "0",
            "&:last-child": {
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
            }
        }}
        >
            <Grid container spacing={2}>
                <Grid item>
                    <Avatar src={commentData.owner.profileImage} alt={commentData.owner.userName} />
                </Grid>
                <Grid item xs>
                    <Box>
                        <Button
                            sx={{ fontSize: "14px", color: "black", textTransform: "capitalize ", p: 0, "&:hover": { bgcolor: "unset" } }}
                            variant='text'
                            onClick={() => router.push(`/profile/${commentData.ownerId}`)}
                        >
                            {commentData.owner.userName}
                        </Button>
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
