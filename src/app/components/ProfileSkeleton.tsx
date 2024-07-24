import { Avatar, Box, Skeleton } from '@mui/material'
import React from 'react'

const ProfileSkeleton = () => {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            gap: "38px",
            width: "100%",
        }}>
            <Box sx={{
                "& img": {
                    height: '200px',
                    width: '200px'
                },
            }}>
                <Avatar
                    sx={{
                        height: "200px",
                        width: "200px",
                        ml: "24px"
                    }}
                >
                    <Skeleton variant='circular' height={"100%"} width={"100%"} animation="wave" />
                </Avatar>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                justifyContent: "center",
                width: "100%"
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "18px",
                    alignItems: "center"
                }}>
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                        variant='rounded'
                    />
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "32px",
                    alignItems: "center"
                }}>
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                        variant='rounded'
                    />
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="70%"
                        style={{ marginBottom: 6 }}
                        variant='rounded'
                    />
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="65%"
                        style={{ marginBottom: 6 }}
                        variant='rounded'
                    />
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    alignItems: "start"
                }}>
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                        variant='rounded'
                    />
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="70%"
                        style={{ marginBottom: 6 }}
                        variant='rounded'
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default ProfileSkeleton
