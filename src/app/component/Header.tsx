"use client"
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import React, { forwardRef, useEffect, useState } from 'react'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { SearchRounded } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { API } from '../lib/axios';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useRouter } from 'next/navigation';

interface UserData {
    id: string;
    name: string;
    profileImage: string;
    userName: string;
}

const Header = forwardRef<HTMLDivElement>((props,ref) => {
    const [profileData, setProfileData] = useState<UserData>({} as UserData)
    const [loading, setLoading] = useState<boolean>(true)
    const [searchName, setSearchName] = useState("")

    const router = useRouter()

    const fetchData = async () => {
        try {
            const response = await API.get("/api/user/get-current-user");
            setProfileData(response.data.user)
            setLoading(false)
        } catch (error: any) {
            toast.error(error?.response?.data?.error ?? "Something  went wrong while fetching user data")
            setLoading(false)
        }
    };

    const logout = async () => {
        try {
            const response = await API.get("/api/user/logout");
            toast.success(response.data.message ?? "Logged out successfully.")
            router.push("/login")
            setLoading(false)
        } catch (error: any) {
            toast.error(error?.response?.data?.error ?? "Something  went wrong while logout.")
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box
            ref={ref}
            id='header'
            component="nav"
            sx={{
                display: 'flex',
                px: "28px",
                py: "16px",
                alignItems: "center",
                position: "sticky",
                zIndex: '2',
                bgcolor: "#f7f7f7",
                top: 0,
                borderBottom: "1px solid #d9d9d9"
            }}
        >
            <Typography variant="body1">Hello, {profileData.name} 👋</Typography>
            <Box sx={{
                display: 'flex',
                gap: '16px',
                alignItems: "center",
                ml: "auto",
                mr: "0"
            }}>
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRounded />
                            </InputAdornment>
                        ),
                    }}
                    variant="standard"
                    placeholder="Search"
                    sx={{
                        ml: 2,
                        borderRadius: "12px",
                        p: "0"
                    }}
                />
                <Button
                    startIcon={
                        <AddBoxOutlinedIcon />
                    }
                    sx={{
                        backgroundColor: "black",
                        color: "white",
                        textTransform: "capitalize",
                        p: "8px 16px",
                        borderRadius: "12px",
                        width: '140px',
                        display: "flex",
                        justifyContent: "center",
                        "&:hover": {
                            backgroundColor: "#777",
                        }
                    }}
                >
                    New post
                </Button>
                <IconButton onClick={logout}>
                    <LogoutRoundedIcon />
                </IconButton>
            </Box>
        </Box >
    )
})

export default Header
