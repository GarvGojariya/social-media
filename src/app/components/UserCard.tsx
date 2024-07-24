"use client"
import { Avatar, Button, Card, CardHeader, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/navigation';
import React from 'react'
import FollowingIcon from "@/assets/icons/followingIcon.svg"
import AddPersonIcon from "@/assets/icons/addPersonIcon.svg"
import toast from 'react-hot-toast';
interface UserCardProps {
    id: string;
    name: string;
    userName: string;
    profileImage: string;
    isFollowed?: boolean;
    buttonClick?: (id: string) => void;
}

const UserCard = ({
    id,
    name,
    userName,
    profileImage,
    isFollowed = false,
    buttonClick
}: UserCardProps) => {

    const router = useRouter()

    return (
        <Card sx={{
            borderBottom: "1px solid #eeeeee", backgroundColor: "white", margin: 0, boxShadow: "unset", borderRadius: "0", cursor: "pointer", overflow: "visible",
            '&: last-child': {
                borderBottom: 'unset',
            },
        }}
        >
            <CardHeader
                sx={{
                    "& img": {
                        height: "100%",
                        width: "100%",
                    }, width: "100%"
                }}
                avatar={
                    <Avatar aria-label="recipe">
                        <img src={profileImage} alt='User Image' />
                    </Avatar>
                }
                action={
                    <IconButton onClick={() => router.push("/")} onClickCapture={
                        (e) => {
                            e.stopPropagation()
                            if (buttonClick) buttonClick(id)
                        }
                    }>
                        {isFollowed ? <FollowingIcon /> : <AddPersonIcon />}
                    </IconButton>
                }
                title={
                    <Typography variant="body2" color="black">{userName}</Typography>
                }
                subheader={
                    <Typography variant="body2" color="#777">{name}</Typography>
                }
                onClick={() => router.push(`/profile/${id}`)}
            />
        </Card>
    )
}

export default UserCard
