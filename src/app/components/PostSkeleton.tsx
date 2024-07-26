import { Card, CardContent, CardHeader, IconButton, Skeleton } from '@mui/material'
import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PostSkeleton = () => {
    return (
        <Card sx={{
            width: "100%", m: 2, bgcolor: "#ffffff", "& .MuiSkeleton-root:after": {
                background: "linear-gradient(90deg, transparent, rgb(167 162 162 / 8%), transparent)"
            }
        }}>
            <CardHeader
                avatar={
                    <Skeleton animation="wave" variant="circular" width={40} height={40} />
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                    />
                }
                subheader={
                    <Skeleton animation="wave" height={10} width="40%" />
                }
            />
            <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
            <CardContent>
                <React.Fragment>
                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skeleton animation="wave" height={10} width="80%" />
                </React.Fragment>
            </CardContent>
        </Card>
    )
}

export default PostSkeleton
