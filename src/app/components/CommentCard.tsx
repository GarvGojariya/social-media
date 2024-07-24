import React from 'react'
import { Comment } from '../../../types/globalTypes'
import { Avatar, Box, Grid, Paper, Typography } from '@mui/material'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

const CommentCard = (commentData: Comment) => {
    return (
        <Paper variant='elevation'>
            <Grid container>
                <Grid item>
                    <Avatar src={commentData.owner.profileImage} />
                </Grid>
                <Grid item>
                    <Box>
                        <Typography>{commentData.owner.userName}</Typography>
                        <Typography>{commentData.text}</Typography>
                    </Box>
                    {commentData.isLiked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                </Grid>
            </Grid>
        </Paper>
    )
}

export default CommentCard
