"use client"
import { 
    Box, 
    Typography, 
    Card, 
    CardContent,
    Chip,
    Stack,
    Divider
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import PeopleIcon from "@/assets/icons/peopleIcon.svg"
import { API } from '../lib/axios'
import UserCard from './UserCard'
import { useRouter } from 'next/navigation'
import UserSkeleton from './UserSkeleton'
import toast from 'react-hot-toast'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

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
            width: 320,
            height: "100%",
            boxSizing: "border-box",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}>
            <Card 
                sx={{ 
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 2, 
                        mb: 3 
                    }}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <PeopleOutlineIcon />
                        </Box>
                        <Box>
                            <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5 }}>
                                Discover People
                            </Typography>
                            <Typography variant='body2' color="text.secondary">
                                Connect with new friends
                            </Typography>
                        </Box>
                    </Box>
                    
                    {loading && (
                        <Stack spacing={2}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <UserSkeleton key={index} />
                            ))}
                        </Stack>
                    )}
                    
                    {!loading && suggestedUsers.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                No suggestions available
                            </Typography>
                        </Box>
                    )}
                    
                    {!loading && suggestedUsers.length > 0 && (
                        <Stack spacing={1} sx={{ maxHeight: 400, overflowY: 'auto' }}>
                            {suggestedUsers.map((user: User) => (
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
                        </Stack>
                    )}
                </CardContent>
            </Card>
            
            <Card 
                sx={{ 
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    bgcolor: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                        Quick Stats
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip 
                            label={`${suggestedUsers.length} Suggestions`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                        />
                        <Chip 
                            label="Active Now" 
                            size="small" 
                            color="success" 
                            variant="outlined" 
                        />
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )
}

RightSidebar.displayName = "RightSidebar";

export default RightSidebar
