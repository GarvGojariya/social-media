"use client";

import { Box } from "@mui/material";
import { useRef, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import toast from "react-hot-toast";
import PostSkeleton from "@/app/component/PostSkeleton";
import PostCard from "@/app/component/PostCard";
import { fetchPosts } from "@/app/actions/postActions";

export default function Home() {
  const observer = useRef<HTMLDivElement | null>(null);

  // Fetcher function using server action
  const fetcher = async (pageNo: number) => fetchPosts(pageNo);

  // SWR Infinite for pagination
  const { data, size, setSize, isValidating, error } = useSWRInfinite(
    (index) => `/api/posts?pageNo=${index + 1}`,
    async (url) => {
      const pageNo = parseInt(url.split("=")[1], 10);
      return fetchPosts(pageNo);
    }
  );

  // Flatten posts data
  const postsData = data ? data.flatMap((page) => page.posts) : [];
  const totalPosts = data ? data[0]?.totalPosts || 0 : 0;
  const hasMore = postsData.length < totalPosts;

  // Infinite Scroll Observer
  useEffect(() => {
    if (!observer.current || isValidating) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && postsData.length > 0) {
        setSize(size + 1); // Load next page
      }
    };

    const newObserver = new IntersectionObserver(handleObserver, {
      threshold: 1,
    });
    newObserver.observe(observer.current);

    return () => newObserver.disconnect();
  }, [size, isValidating]);

  if (error) {
    toast.error("Failed to load posts");
  }

  return (
    <Box
      sx={{ height: "100%", overflowY: "auto", width: "100%" }}
      id="scrollableDiv"
    >
      {/* Skeleton Loading */}
      {isValidating &&
        !postsData.length &&
        Array.from({ length: 2 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}

      {/* Post List */}
      {/* {!isValidating && ( */}
      <>
        {postsData.map((post) => (
          <PostCard postData={post} key={post.id} />
        ))}
        {/* Infinite Scroll Trigger */}
        <div ref={observer} className="h-10 flex justify-center items-center">
          {hasMore && <PostSkeleton />}
        </div>
      </>
      {/* )} */}
    </Box>
  );
}
