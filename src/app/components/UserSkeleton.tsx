import { Card, CardContent, CardHeader, IconButton, Skeleton } from '@mui/material'
import React from 'react'

const UserSkeleton = () => {
    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardHeader
                avatar={
                    <Skeleton animation="wave" variant="circular" width={40} height={40} />
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
        </Card>
    )
}

export default UserSkeleton
