import { Button, Card, CardHeader, Typography } from '@mui/material'
import Image from 'next/image';
import React from 'react'

interface UserCardProps {
    id: string;
    name: string;
    userName: string;
    profileImage: string;
    isFollowed?: boolean;
}

const UserCard = ({
    id,
    name,
    userName,
    profileImage,
    isFollowed = false
}: UserCardProps) => {
    return (
        <Card sx={{ maxWidth: 345, m: 2 }} key={`${id}_profilecard`}>
            <CardHeader
                avatar={
                    <Image src={profileImage} alt='User Image' />
                }
                action={
                    <Button>{isFollowed ? "Following" : "Follow"}</Button>
                }
                title={
                    <Typography variant="body2" color="text.secondary">{userName}</Typography>
                }
                subheader={
                    <Typography variant="body2" color="text.secondary">{name}</Typography>
                }
            />
        </Card>
    )
}

export default UserCard
