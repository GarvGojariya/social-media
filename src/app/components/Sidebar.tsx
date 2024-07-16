"use client"
import { Avatar, Box, Button, Card, CardHeader, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import HomeIcon from "@/assets/icons/homeIcon.svg"
import SaveIcon from "@/assets/icons/saveIcon.svg"
import HeartIcon from "@/assets/icons/heartIcon.svg"
import SettingIcon from "@/assets/icons/settingIcon.svg"
import "@/app/globals.css"
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useRouter } from 'next/navigation';
import { API } from '../lib/axios';
import { ProfileData } from '../../../types/globalTypes';
import toast from 'react-hot-toast';

interface navLink {
    id: string;
    name: string;
    link: string;
    icon: ReactElement;
}

interface UserData {
    id: string;
    name: string;
    profileImage: string;
    userName: string;
}

const Sidebar = () => {

    const [profileData, setProfileData] = useState<ProfileData>({} as ProfileData)

    const fetchData = async () => {
        try {
            const response = await API.get("/api/user/get-current-user");
            setProfileData(response.data.user)
        } catch (error: any) {
            toast.error(error?.response?.data?.error ?? "Something  went wrong while fetching user data")
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const router = useRouter()

    const navLinks: navLink[] = [
        {
            id: "home",
            name: 'Home',
            link: '/',
            icon: <HomeIcon />
        },
        {
            id: "save",
            name: 'Saved',
            link: '/saved',
            icon: <SaveIcon />
        },
        {
            id: "notifications",
            name: 'Notifications',
            link: '/notifications',
            icon: <HeartIcon />
        }, {
            id: "setting",
            name: 'Setting',
            link: '/setting',
            icon: <SettingIcon />
        }
    ]

    return (
        <Box component="main" sx={{
            maxWidth: "20%",
            minWidth: "250px",
            height: "100vh",
            boxSizing: "border-box",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRight: "1px solid #e8e8e8"
        }} role="main">
            <Typography sx={{
                fontSize: "26px",
                fontWeight: "bold",
                fontFamily: "cursive"
            }}>
                Instagram
            </Typography>
            <List>
                {navLinks.map((link) => (
                    <ListItem key={link.name} disablePadding sx={{
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.05)"
                        },
                    }}>
                        <ListItemButton sx={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center"
                        }}>
                            <ListItemIcon sx={{
                                width: "auto",
                                minWidth: "fit-content"
                            }}>
                                {link.icon}
                            </ListItemIcon>
                            <ListItemText primary={
                                <Typography>{link.name}</Typography>
                            } />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Card sx={{ maxWidth: 345, mb: 0, mt: "auto", backgroundColor: "transparent" }} key={`${profileData.id}_profilecard`}>
                <CardHeader
                    onClick={() => router.push("/profile")}
                    sx={{
                        "& img": {
                            height: "100px",
                            width: "100px",
                        },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                    }}
                    avatar={
                        <Avatar aria-label="recipe">
                            <img src={profileData.profileImage} alt='User Image' />
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <ChevronRightRoundedIcon sx={{
                                color: "black"
                            }} />
                        </IconButton>
                    }
                    title={
                        <Typography variant="body2" color="black">{profileData.userName}</Typography>
                    }
                    subheader={
                        <Typography variant="body2" color="black">{profileData.name}</Typography>
                    }
                />
            </Card>
        </Box>
    )
}

export default Sidebar
