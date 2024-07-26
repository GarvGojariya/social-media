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
import toast from 'react-hot-toast';
import UserSkeleton from './UserSkeleton';
import { getCurrentUserData } from '../../../utils/globalHelpers/globalHelpers';

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

    // const { data: session } = useSession()

    const [profileData, setProfileData] = useState<UserData>({} as UserData)
    const [loading, setLoading] = useState<boolean>(true)

    const fetchData = async () => {
        try {
            // const response = await API.get("/api/user/get-current-user");
            // setProfileData(response.data.user)
            // setLoading(false)
            const data = await getCurrentUserData()
            if (data) {
                setProfileData(data)
            }else{
                toast.error("Something went wrong")
            }
            setLoading(false)
        } catch (error: any) {
            toast.error("Something  went wrong while fetching user data")
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchData();
        // if (session && session.user) {
        //     setProfileData({
        //         id: session.user.id ?? "",
        //         name: session.user.name ?? "User",
        //         profileImage: session.user.profileImage ?? "https://res.cloudinary.com/dk27cpuh4/image/upload/v1715344128/ukzqdp4dcmdnjtzfiz6e.png",
        //         userName: session.user.userName ?? "",
        //     })
        // }
        // const data = getCurrentUserData()
        // if (data) {
        //     setProfileData(data)
        // }
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
            link: '/saved-posts',
            icon: <SaveIcon />
        },
        {
            id: "notifications",
            name: 'Notifications',
            link: '/notifications',
            icon: <HeartIcon />
        }, {
            id: "settings",
            name: 'Settings',
            link: '/settings',
            icon: <SettingIcon />
        }
    ]

    return (
        <Box sx={{
            maxWidth: "20%",
            minWidth: "250px",
            height: "100vh",
            boxSizing: "border-box",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRight: "1px solid #cfcfcf",
            position: "sticky",
            top: 0,
            zIndex: 2
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
                        borderRadius: "8px"
                    }}>
                        <ListItemButton sx={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center"
                        }}
                            onClick={() => router.push(link.link)}
                        >
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
                {
                    loading ? <UserSkeleton /> :
                        <CardHeader
                            onClick={() => router.push("/profile")}
                            sx={{
                                "& img": {
                                    height: "100%",
                                    width: "100%",
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
                        />}
            </Card>
        </Box>
    )
}

export default Sidebar
