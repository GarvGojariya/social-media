"use client"
import Image from "next/image";
import styles from "../../page.module.css";
import { useSession } from "next-auth/react";
import { Backdrop, Box } from "@mui/material";
import { API } from "@/app/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import PostSkeleton from "@/app/component/PostSkeleton";
import PostCard from "@/app/component/PostCard";
import Loader from "@/app/component/Loader";
import CommentCard from "@/app/component/CommentCard";
import { Post } from "../../../../../types/globalTypes";
// import PostSkeleton from "../../components/PostSkeleton";
// import UserSkeleton from "../../components/UserSkeleton";

const Page = () => {
    const [pageNo, setPageNo] = useState<number>(1)
    const [postsData, setPostsData] = useState<Post[]>([])
    const [totalPosts, setTotalPosts] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true)

    const fetchPosts = async () => {
        try {
            const response = await API.get(`/api/post/get-saved-posts?pageNo=${pageNo}`)
            const { savedPosts, totalPosts } = response.data
            setPostsData(savedPosts)
            setTotalPosts(totalPosts)
            setLoading(false)
            // toast.success(response.data?.message)
        } catch (error: any) {
            console.log(error)
            setLoading(false)
            toast.error(error?.response?.data?.error ?? "Something  went wrong while fetch post.")
        }
    }

    const fetchNextPage = async () => {
        try {
            const response = await API.get(`/api/post/get-saved-posts?pageNo=${pageNo + 1}`);
            const { savedPosts, totalPosts: newTotalPosts } = response.data;
            setPostsData([...postsData, ...savedPosts]);
            setTotalPosts(newTotalPosts); // Update totalPosts here
            setPageNo(pageNo + 1);
            // toast.success(response.data?.message);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error ?? "Something went wrong while fetching posts.");
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    useEffect(() => {
        setHasMore(postsData.length < totalPosts);
    }, [postsData, totalPosts]);

    return (
        <>
            <Box sx={{
                paddingX: "32px",
                paddingY: "16px",
                height: "100%",
                overflowY: "auto",
                width: "100%"
            }}
                id="scrollableDiv">
                {
                    loading && Array.from({ length: 2 }).map((_, index) => (
                        <PostSkeleton key={index} />
                    ))
                }
                {!loading &&
                    <InfiniteScroll
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        }}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <strong>{hasMore ? "Loading..." : postsData.length > 0 ? "No more posts" : "No saved post yet."}</strong>
                            </p>
                        }
                        dataLength={postsData.length}
                        hasMore={hasMore}
                        loader={<PostSkeleton />}
                        next={fetchNextPage}
                        scrollableTarget="scrollableDiv"
                    >
                        {
                            postsData.map((post: any, index: number) => (
                                <PostCard postData={
                                    {
                                        ...post,
                                        isSaved: true
                                    }
                                } key={index} />
                            ))
                        }
                    </InfiniteScroll>
                }
            </Box>
        </>
    );
}

export default Page
