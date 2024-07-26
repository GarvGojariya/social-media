"use client"
import Image from "next/image";
import styles from "../../page.module.css";
import { useSession } from "next-auth/react";
import { Backdrop, Box } from "@mui/material";
import { API } from "@/app/lib/axios";
import { useEffect, useState } from "react";
import { Post } from "../../../../types/globalTypes";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import PostSkeleton from "@/app/component/PostSkeleton";
import PostCard from "@/app/component/PostCard";
import Loader from "@/app/component/Loader";
import CommentCard from "@/app/component/CommentCard";
import CommentModel from "@/app/component/CommentModel";
// import PostSkeleton from "../../components/PostSkeleton";
// import UserSkeleton from "../../components/UserSkeleton";

export default function Home() {

  const [pageNo, setPageNo] = useState<number>(1)
  const [postsData, setPostsData] = useState<Post[]>([])
  const [totalPosts, setTotalPosts] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState<boolean>(false)
  const [postId, setPostId] = useState<string>("")

  const fetchPosts = async () => {
    try {
      const response = await API.get(`/api/post/fetch-posts?pageNo=${pageNo}`)
      const { posts, totalPosts } = response.data
      setPostsData(posts)
      setTotalPosts(totalPosts)
      setLoading(false)
      toast.success(response.data?.message)
    } catch (error: any) {
      console.log(error)
      setLoading(false)
      toast.error(error?.response?.data?.error ?? "Something  went wrong while fetch post.")
    }
  }

  const fetchNextPage = async () => {
    try {
      const response = await API.get(`/api/post/fetch-posts?pageNo=${pageNo + 1}`);
      const { posts, totalPosts: newTotalPosts } = response.data;
      setPostsData([...postsData, ...posts]);
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
        width:"100%"
      }}
        id="scrollableDiv">
        {/* <Backdrop open={loading}>
        <Loader />
      </Backdrop> */}
        {
          loading && Array.from({ length: 2 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))
        }
        {!loading && <InfiniteScroll
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}
          endMessage={"You have all caught!"}
          dataLength={postsData.length}
          hasMore={hasMore}
          loader={<PostSkeleton />}
          next={fetchNextPage}
          scrollableTarget="scrollableDiv"
        >
          {
            postsData.map((post: any, index: number) => (
              <PostCard postData={post} key={index} />
            ))
          }
        </InfiniteScroll>}
      </Box>
    </>
  );
}
