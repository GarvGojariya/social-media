"use client"
import { 
    Avatar, 
    Box, 
    Card, 
    CardHeader, 
    IconButton, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Typography,
    Chip,
    Divider
} from '@mui/material';
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import HomeIcon from "@/assets/icons/homeIcon.svg"
import SaveIcon from "@/assets/icons/saveIcon.svg"
import HeartIcon from "@/assets/icons/heartIcon.svg"
import SettingIcon from "@/assets/icons/settingIcon.svg"
import "@/app/globals.css"
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
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

    const pathname = usePathname();
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
            width: "280px",
            height: "100vh",
            boxSizing: "border-box",
            padding: 3,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
            position: "sticky",
            top: 0,
            zIndex: 2,
            bgcolor: 'background.paper',
        }} role="main">
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography 
                    variant="h4" 
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                    }}
                >
                    SocialApp
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Connect & Share
                </Typography>
            </Box>
            
            <List sx={{ flexGrow: 1, px: 0 }}>
                {navLinks.map((link) => {
                    const isActive = pathname === link.link;
                    return (
                        <ListItem key={link.name} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton 
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    px: 2,
                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'white' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                                onClick={() => router.push(link.link)}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 40,
                                    color: isActive ? 'white' : 'text.secondary',
                                }}>
                                    {link.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontWeight: isActive ? 600 : 500,
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            {link.name}
                                        </Typography>
                                    } 
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Card 
                sx={{ 
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                    border: '1px solid rgba(25, 118, 210, 0.12)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        transform: 'translateY(-1px)',
                    },
                }} 
                onClick={() => router.push("/profile")}
            >
                {loading ? (
                    <UserSkeleton />
                ) : (
                    <CardHeader
                        avatar={
                            <Avatar 
                                src={profileData.profileImage} 
                                alt={profileData.name}
                                sx={{ width: 48, height: 48 }}
                            />
                        }
                        action={
                            <IconButton size="small">
                                <ChevronRightRoundedIcon />
                            </IconButton>
                        }
                        title={
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {profileData.userName}
                            </Typography>
                        }
                        subheader={
                            <Typography variant="body2" color="text.secondary">
                                {profileData.name}
                            </Typography>
                        }
                        sx={{ pb: 2 }}
                    />
                )}
            </Card>
        </Box>
    )
}

Sidebar.displayName = "Sidebar";

export default Sidebar
