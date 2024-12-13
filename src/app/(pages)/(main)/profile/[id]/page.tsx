"use client"
import { API } from '@/app/lib/axios';
import { Avatar, Backdrop, Box, Button, ImageList, ImageListItem, Skeleton, Tab, Tabs, Typography } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from '@/app/component/Loader';
import ProfileSkeleton from '@/app/component/ProfileSkeleton';
import UserSkeleton from '@/app/component/UserSkeleton';
import UserCard from '@/app/component/UserCard';
import { Follower, Following, Post, ProfileData, savedPost } from '../../../../../../types/globalTypes';
import { useParams } from 'next/navigation';
import HorizontalPostCard from '@/app/component/HorizontalPostCard';

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
    openPostLoading: boolean;
}

const Page = () => {
    const params = useParams()
    const userId = params.id

    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState<loading>({
        profileDataLoading: true,
        followersLoading: true,
        followingLoading: true,
        savedPostsLoading: true,
        openPostLoading: true
    })
    const [profileData, setProfileData] = useState<ProfileData>({} as ProfileData)
    const [followers, setFollowers] = useState<Follower[]>([] as Follower[])
    const [following, setFollowing] = useState<Following[]>([] as Following[])
    const [followerPageNo, setfollowerPageNo] = useState<number>(1)
    const [followingPageNo, setFollowingPageNo] = useState<number>(1)
    const [totalFollowers, setTotalFollowers] = useState<number>(0)
    const [isFollowed, setIsFollowed] = useState<boolean>(false)
    const [isPostModelOpen, setIsPostModelOpen] = useState<boolean>(false)
    const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false)
    const [openedPostData, setOpenedPostData] = useState<Post>({} as Post)

    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const getUserData = async () => {
        try {
            const response = await API.get(`/api/user/get-user?userId=${userId}`)
            console.log(response.data)
            setProfileData(response.data?.data.user ?? {})
            setIsFollowed(response.data?.data?.following)
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

    const getSinglePostDetail = async (postId: string) => {
        try {
            setLoading({
                ...loading,
                openPostLoading: true,
            })
            const response = await API.get(`/api/post/get-post-detail?id=${postId}`)
            setOpenedPostData(response.data.data)
            setLoading({
                ...loading,
                openPostLoading: false,
            })
            console.log(response.data)
        } catch (error: any) {
            toast.error(error?.response?.data?.error ?? "Something  went wrong while fetching postdetail.")
            setLoading({
                ...loading,
                openPostLoading: false,
            })
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
            await getUserFollowers()
            await getUserFollowing()
            toast.success(response.data.message)
        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.error ?? "Something went wrong please try again.")
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    useEffect(() => {
        if (value === 1) {
            getUserFollowing()
        } else if (value === 2) {
            getUserFollowers()
        }
    }, [profileData, value])

    return (
        <>
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
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "12px",
                                alignItems: "center"
                            }}>
                                <Typography>
                                    {profileData?.name}
                                </Typography>
                                <Button variant='contained' sx={{
                                    color: "white",
                                    backgroundColor: "black",
                                    "&:hover": {
                                        backgroundColor: "#777"
                                    },
                                    textTransform: "capitalize",
                                    borderRadius: "12px"
                                }}
                                    onClick={async () => {
                                        await toggleFollow(profileData.id)
                                        await getUserData()
                                    }}
                                >
                                    {isFollowed ? "Following" : "Follow"}
                                </Button>
                            </Box>
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
                                }}
                                    onClick={(e) => {
                                        if (e.type === "click") {
                                            setIsPostModelOpen(true)
                                            getSinglePostDetail(item.id)
                                        } else if (e.type === "contextmenu") {
                                            e.preventDefault()
                                            setIsContextMenuOpen(true)
                                        }
                                    }}
                                >
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
                                        isFollowed={follow.following.isFollowed}
                                        buttonClick={toggleFollow}
                                    />
                                ))}
                            </Box>
                        )}
                    </TabPanel>
                    <TabPanel value={value} index={2}>
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
                                {followers.map((follower: Follower) => (
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
            <Backdrop sx={{
                zIndex: "3"
            }} open={isPostModelOpen}
            // onClick={() => setIsPostModelOpen(false)}
            >
                {
                    loading.openPostLoading ?
                        <Loader />
                        :
                        <HorizontalPostCard postData={openedPostData} setIsPostOpen={setIsPostModelOpen} />
                }
            </Backdrop>
        </>
    )
}

export default Page
