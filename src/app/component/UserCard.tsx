"use client"
import { 
    Avatar, 
    Button, 
    Card, 
    CardContent, 
    IconButton, 
    Typography, 
    Box,
    Stack
} from '@mui/material'
import { useRouter } from 'next/navigation';
import React from 'react'
import FollowingIcon from "@/assets/icons/followingIcon.svg"
import AddPersonIcon from "@/assets/icons/addPersonIcon.svg"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

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
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            cursor: "pointer", 
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderColor: 'primary.main',
            },
        }}>
            <CardContent 
                sx={{
                    p: 2,
                    '&:last-child': { pb: 2 },
                }}
                onClick={() => router.push(`/profile/${id}`)}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                        src={profileImage} 
                        alt={name}
                        sx={{ 
                            width: 48, 
                            height: 48,
                            border: '2px solid',
                            borderColor: 'primary.main',
                        }}
                    />
                    
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {userName}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {name}
                        </Typography>
                    </Box>
                    
                    <Button
                        variant={isFollowed ? "outlined" : "contained"}
                        size="small"
                        startIcon={isFollowed ? <PersonRemoveIcon /> : <PersonAddIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (buttonClick) buttonClick(id);
                        }}
                        sx={{
                            minWidth: 100,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {isFollowed ? 'Following' : 'Follow'}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}

UserCard.displayName = "UserCard";

export default UserCard
