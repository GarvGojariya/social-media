"use client"
import { API } from '@/app/lib/axios';
import { Avatar, Backdrop, Box, Button, ImageList, ImageListItem, Skeleton, Tab, Tabs, Typography } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Follower, Following, ProfileData, savedPost } from '../../../../../types/globalTypes';
import Loader from '@/app/component/Loader';
import ProfileSkeleton from '@/app/component/ProfileSkeleton';
import UserSkeleton from '@/app/component/UserSkeleton';
import UserCard from '@/app/component/UserCard';

interface TabPanelProps {
    children: ReactNode;
    value: number;
    index: number;
}

interface loading {
    profileDataLoading: boolean;
    followersLoading: boolean;
    followingLoading: boolean;
    savedPostsLoading: boolean;
}

const Page = () => {
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );

    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState<loading>({
        profileDataLoading: true,
        followersLoading: true,
        followingLoading: true,
        savedPostsLoading: true,
    })
    const [profileData, setProfileData] = useState<ProfileData>({} as ProfileData)
    const [followers, setFollowers] = useState<Follower[]>([] as Follower[])
    const [following, setFollowing] = useState<Following[]>([] as Following[])
    const [followerPageNo, setfollowerPageNo] = useState<number>(1)
    const [followingPageNo, setFollowingPageNo] = useState<number>(1)
    const [savedPosts, setSavedPosts] = useState<savedPost[]>([])
    const [totalFollowers, setTotalFollowers] = useState<number>(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const getCurrentUserData = async () => {
        try {
            const response = await API.get("/api/user/get-current-user")
            setProfileData(response.data.user ?? {})
            setLoading({
                ...loading,
                profileDataLoading: false,
            })
        } catch (error: any) {
            toast.error(error?.response?.data?.error ?? "Something  went wrong while logout.")
            setLoading({
                ...loading,
                profileDataLoading: false,
            })
        }
    }

    const getUserFollowers = async () => {
        if (profileData && profileData.id) {
            try {
                setLoading({
                    ...loading,
                    followersLoading: true,
                })
                const response = await API.get(`/api/follow/get-followers?userId=${profileData.id}&pageNo=${followerPageNo}`)
                setFollowers(response.data.followers)
                setTotalFollowers(response.data.totalFollowers)
                setLoading({
                    ...loading,
                    followersLoading: false,
                })
            } catch (error: any) {
                toast.error(error?.response?.data?.error ?? "Something  went wrong while logout.")
                setLoading({
                    ...loading,
                    followersLoading: false,
                })
            }
        }
    }

    const getUserFollowing = async () => {
        if (profileData && profileData.id) {
            try {
                setLoading({
                    ...loading,
                    followingLoading: true,
                })
                const response = await API.get(`/api/follow/get-following?userId=${profileData.id}&pageNo=${followingPageNo}`)
                setFollowing(response.data.following)
                setLoading({
                    ...loading,
                    followingLoading: false,
                })
            } catch (error: any) {
                toast.error(error?.response?.data?.error ?? "Something  went wrong while logout.")
                setLoading({
                    ...loading,
                    followingLoading: false,
                })
            }
        }
    }

    const toggleFollow = async (id: string) => {
        try {
            const response = await API.post(`/api/follow/create?opponentId=${id}`)
            toast.success(response.data.message)
            getUserFollowers()
            getUserFollowing()
        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.error ?? "Something went wrong please try again.")
        }
    }

    const getSavedPosts = async () => {
        try {
            setLoading({
                ...loading,
                savedPostsLoading: true,
            })
            const response = await API.get("/api/post/get-saved-posts")
            setSavedPosts(response.data.savedPosts)
            setLoading({
                ...loading,
                savedPostsLoading: false,
            })
        } catch (error: any) {
            toast.error(error?.response?.data?.error ?? "Something  went wrong while fetching saved posts.")
            setLoading({
                ...loading,
                savedPostsLoading: false,
            })
        }
    }

    useEffect(() => {
        getCurrentUserData()
    }, [])

    useEffect(() => {
        if (value === 2) {
            getUserFollowing()
        } else if (value === 3) {
            getUserFollowers()
        } else if (value === 1) {
            getSavedPosts()
        }
    }, [profileData, value])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: "28px",
                padding: "28px",
                width: "100%",
                height: "100%",
            }}
        >
            {/* <Backdrop
                sx={{ color: '#fff', zIndex: 10 }}
                open={loading}
            >
                <Loader />
            </Backdrop> */}
            {loading.profileDataLoading ? <ProfileSkeleton /> : <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: "38px"
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
                        src={profileData?.profileImage}
                    />
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "18px",
                        alignItems: "center"
                    }}>
                        <Typography>
                            {profileData?.userName ?? ""}
                        </Typography>
                        <Button sx={{
                            textTransform: "capitalize"
                        }}>
                            Edit profile
                        </Button>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "32px",
                        alignItems: "center"
                    }}>
                        <Typography>
                            {profileData?._count?.posts} Posts
                        </Typography>
                        <Typography>
                            {profileData?._count?.followers} Followers
                        </Typography>
                        <Typography>
                            {profileData?._count?.following} Following
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        alignItems: "start"
                    }}>
                        <Typography>
                            {profileData?.name}
                        </Typography>
                        <Typography>
                            {profileData?.bio}
                        </Typography>
                    </Box>
                </Box>
            </Box>}
            <Box
                sx={{
                    borderTop: "1px solid #cfcfcf"
                }}
            >
                <Box>
                    <Tabs
                        centered
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        <Tab label="Posts" />
                        <Tab label="Saved" />
                        <Tab label="Following" />
                        <Tab label="Followers" />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <ImageList variant='quilted' sx={{
                        width: "100%",
                        overflowY: "auto",
                        maxHeight: "450px",
                    }} cols={3} rowHeight={164}>
                        {loading.profileDataLoading && (
                            // <Box sx={{
                            //     width: "100%",
                            //     display: "flex",
                            //     flexDirection: "column",
                            // }}>
                            <>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <ImageListItem
                                        key={index}
                                        sx={{
                                            height: "250px !important"
                                        }}>
                                        <Skeleton width="100%" height="100%" variant='rectangular' animation="wave" key={index} />
                                    </ImageListItem>
                                ))}
                            </>
                            // </Box>
                        )}
                        {!loading.profileDataLoading && profileData?.posts?.length === 0 &&
                            <Box sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                <Typography variant='h6' sx={{ textAlign: "center", marginTop: "20px" }}>No posts found</Typography>
                            </Box>
                        }
                        {!loading.profileDataLoading && profileData?.posts?.map((item) => (
                            <ImageListItem key={item.id} sx={{
                                cursor: "pointer",
                                height: "250px !important"
                            }}>
                                <img
                                    onClick={() => { }}
                                    srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                    alt={""}
                                    loading='lazy'
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ImageList variant='quilted' sx={{
                        width: "100%", overflowY: "auto",
                        maxHeight: "450px"
                    }} cols={3} rowHeight={164}>
                        {loading.savedPostsLoading && (
                            // <Box sx={{
                            //     width: "100%",
                            //     display: "flex",
                            //     flexDirection: "column",
                            // }}>
                            <>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <ImageListItem sx={{
                                        height: "250px !important"
                                    }}
                                        key={index}
                                    >
                                        <Skeleton width="100%" height="100%" variant='rectangular' animation="wave" key={index} />
                                    </ImageListItem>
                                ))}
                            </>
                            // </Box>
                        )}
                        {!loading.savedPostsLoading && savedPosts?.length === 0 &&
                            <ImageListItem sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gridColumnEnd:"span 3 !important"
                            }}>
                                <Typography variant='h6' sx={{ textAlign: "center", marginTop: "20px" }}>No posts found</Typography>
                            </ImageListItem>
                        }
                        {!loading.savedPostsLoading && savedPosts?.map((item) => (
                            <ImageListItem key={item.id} sx={{
                                cursor: "pointer",
                                height: "250px !important"
                            }}>
                                <img
                                    onClick={() => { }}
                                    srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                    alt={""}
                                    loading='lazy'
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {loading.followingLoading && (
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
                    {!loading.followingLoading && following?.length === 0 && (
                        <Typography sx={{
                            textAlign: "center"
                        }}>No Following</Typography>
                    )}
                    {!loading.followingLoading && following.length > 0 && (
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            overflowY: "auto",
                            maxHeight: "450px"
                        }}>
                            {following.map((follow: Following, index: number) => (
                                <UserCard
                                    id={follow.following.id}
                                    key={follow.following.id}
                                    name={follow.following.name}
                                    profileImage={follow.following.profileImage}
                                    userName={follow.following.userName}
                                    isFollowed={true}
                                    buttonClick={toggleFollow}
                                />
                            ))}
                        </Box>
                    )}
                </TabPanel>
                <TabPanel value={value} index={3}>
                    {loading.followersLoading && (
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
                    {!loading.followersLoading && followers?.length === 0 && (
                        <Typography sx={{
                            textAlign: "center"
                        }}>No Followers</Typography>
                    )}
                    {!loading.followersLoading && followers.length > 0 && (
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            overflowY: "auto",
                            maxHeight: "450px"
                        }}>
                            {followers.map((follower: Follower, index: number) => (
                                <UserCard
                                    id={follower.followedBy.id}
                                    key={follower.followedBy.id}
                                    name={follower.followedBy.name}
                                    profileImage={follower.followedBy.profileImage}
                                    userName={follower.followedBy.userName}
                                    isFollowed={follower.followedBy.isFollowed}
                                    buttonClick={toggleFollow}
                                />
                            ))}
                        </Box>
                    )}
                </TabPanel>
            </Box>
        </Box>
    )
}

export default Page
