"use client"
import Image from "next/image";
import styles from "../../page.module.css";
import { useSession } from "next-auth/react";
import { 
  Backdrop, 
  Box, 
  Container, 
  Typography, 
  Stack,
  Fade,
  CircularProgress
} from "@mui/material";
import { API } from "@/app/lib/axios";
import { useEffect, useState } from "react";
import { Post } from "../../../../types/globalTypes";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import PostSkeleton from "@/app/component/PostSkeleton";
import PostCard from "@/app/component/PostCard";
import Loader from "@/app/component/Loader";
import CommentCard from "@/app/component/CommentCard";
import { styled } from '@mui/material/styles';
// import PostSkeleton from "../../components/PostSkeleton";
// import UserSkeleton from "../../components/UserSkeleton";

export default function Home() {

  const [pageNo, setPageNo] = useState<number>(1)
  const [postsData, setPostsData] = useState<Post[]>([])
  const [totalPosts, setTotalPosts] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)

  const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }));

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
      <StyledContainer 
        maxWidth="md" 
        sx={{
          height: "100%",
          overflowY: "auto",
          width: "100%",
          px: { xs: 2, sm: 3 },
        }}
        id="scrollableDiv"
      >
        {loading && (
          <Stack spacing={3} sx={{ width: '100%', maxWidth: 600 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Loading your feed...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discovering amazing content for you
              </Typography>
            </Box>
            {Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </Stack>
        )}
        
        {!loading && (
          <Fade in={!loading} timeout={800}>
            <Box sx={{ width: '100%' }}>
              <InfiniteScroll
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "24px"
                }}
                endMessage={
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    🎉 You are all caught up! No more posts to show.
                  </Typography>
                }
                dataLength={postsData.length}
                hasMore={hasMore}
                loader={<PostSkeleton />}
                next={fetchNextPage}
                scrollableTarget="scrollableDiv"
              >
                {postsData.map((post: any, index: number) => (
                  <PostCard postData={post} key={index} />
                ))}
              </InfiniteScroll>
            </Box>
          </Fade>
        )}
      </StyledContainer>
    </>
  );
}
