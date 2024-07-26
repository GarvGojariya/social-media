import { Card, CardContent, CardHeader, IconButton, Skeleton } from '@mui/material'
import React from 'react'

const UserSkeleton = () => {
    return (
        <Card sx={{
            width: "100%", minWidth: "200px", bgcolor: "#ffffff", boxShadow: "unset", borderBottom: "1px solid #eeeeee", margin: 0, "& .MuiSkeleton-root:after": {
                background: "linear-gradient(90deg, transparent, rgb(167 162 162 / 8%), transparent)"
            },
            '&: last-child': {
                borderBottom: 'unset',
            },
        }}>
            <CardHeader
                avatar={
                    <Skeleton sx={{
                        bgcolor: '#f4f4f4'
                    }} animation="wave" variant="circular" width={40} height={40} />
                }
                title={
                    <Skeleton
                        variant='rounded'
                        sx={{
                            bgcolor: '#f4f4f4'
                        }}
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                    />
                }
                subheader={
                    <Skeleton
                        variant='rounded'
                        sx={{
                            bgcolor: '#f4f4f4'
                        }} animation="wave" height={10} width="40%" />
                }
            />
        </Card>
    )
}

export default UserSkeleton
