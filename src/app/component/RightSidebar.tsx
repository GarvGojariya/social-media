"use client"
import { Box, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PeopleIcon from "@/assets/icons/peopleIcon.svg"
import { API } from '../lib/axios'
import UserCard from './UserCard'
import { useRouter } from 'next/navigation'
import UserSkeleton from './UserSkeleton'
import toast from 'react-hot-toast'

type User = {
    id: string,
    name: string,
    userName: string,
    profileImage: string,
}

const RightSidebar = () => {
    const router = useRouter()

    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([])
    const [pageNo, setPageNo] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        fetchSuggestedUserData(pageNo)
        return () => {
            setPageNo(1)
            setSuggestedUsers([])
        }
    }, [])

    const fetchSuggestedUserData = async (pageNo: number) => {
        try {
            setLoading(true)
            const response = await API.post(`/api/user/suggsted-users?pageNo=${pageNo}`)
            setSuggestedUsers(response.data.suggestedUsers)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const toggleFollow = async (id: string) => {
        try {
            const response = await API.post(`/api/follow/create?opponentId=${id}`)
            toast.success(response.data.message)
            fetchSuggestedUserData(pageNo)
        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.error ?? "Something went wrong please try again.")
        }
    }

    return (
        <Box sx={{
            width: "25%",
            minWidth: '400px',
            height: "100%",
            boxSizing: "border-box",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mr: 0,
            ml: "auto"
        }}>
            <Box sx={{
                width: "100%",
                maxHeight: "75vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "18px",
                padding: "18px",
                gap: "12px"
            }}>
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    gap: "18px",
                    alignItems: "center",
                }}>
                    <PeopleIcon />
                    <Typography variant='h5' sx={{ textTransform: "capitalize" }}>
                        People you may know.
                    </Typography>
                </Box>
                {loading && (
                    <Box sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <UserSkeleton key={index} />
                        ))}
                    </Box>
                )}
                {!loading && suggestedUsers.length === 0 && (
                    <Typography sx={{
                        textAlign: "center"
                    }}>No Suggested Users</Typography>
                )}
                {!loading && suggestedUsers.length > 0 && (
                    <Box sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto"
                    }}>
                        {suggestedUsers.map((user: User, index: number) => (
                            <UserCard
                                id={user.id}
                                key={user.id}
                                name={user.name}
                                profileImage={user.profileImage}
                                userName={user.userName}
                                isFollowed={false}
                                buttonClick={toggleFollow}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default RightSidebar
