"use client";
import {
  Backdrop,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API } from "../lib/axios";
import { useRouter } from "next/navigation";
import CreatePostModel from "./CreatePostModel";
import { useSession } from "next-auth/react";
import { SearchRounded } from "@mui/icons-material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

interface UserData {
  id: string;
  name: string;
  profileImage: string;
  userName: string;
}

const Header = forwardRef<HTMLDivElement>((props, ref) => {
  const { data } = useSession();

  const [profileData, setProfileData] = useState<UserData>({} as UserData);
  const [isCreatePostModelOpen, setIsCreatePostModelOpen] =
    useState<boolean>(false);

  const router = useRouter();

  const logout = async () => {
    try {
      const response = await API.get("/api/user/logout");
      toast.success(response.data.message ?? "Logged out successfully.");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ?? "Something  went wrong while logout."
      );
    }
  };

  useEffect(() => {
    // fetchData();
    // (async () => {
    //   const ddddd = await callInternalApi();
    //   console.log("🚀 ~ ddddd:", ddddd);
    // })();
    (async () => {
      if (data?.user) {
        await setProfileData(data.user as UserData);
        // setLoading(false);
      }
    })();
  }, [data]);

  return (
    <>
      <Box
        ref={ref}
        id="header"
        component="nav"
        sx={{
          display: "flex",
          px: "18px",
          py: "8px",
          alignItems: "center",
          position: "sticky",
          zIndex: "2",
          bgcolor: "#f7f7f7",
          top: 0,
          borderBottom: "1px solid #d9d9d9",
          // height:"80px"
        }}
      >
        <Typography variant="body1">{profileData.name}</Typography>
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            ml: "auto",
            mr: "0",
          }}
        >
          {/* <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
            }}
            variant="standard"
            placeholder="Search"
            sx={{
              ml: 2,
              borderRadius: "12px",
              p: "0",
            }}
          /> */}
          <IconButton
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "black",
                color: "white",
                opacity: "0.5",
                transition: "0.3s",
              },
            }}
            onClick={() => setIsCreatePostModelOpen(true)}
          >
            <AddBoxOutlinedIcon />
          </IconButton>
          {/* <IconButton onClick={logout}>
            <LogoutRoundedIcon />
          </IconButton> */}
        </Box>
      </Box>
      <Backdrop
        sx={{
          zIndex: "2",
        }}
        open={isCreatePostModelOpen}
      >
        <CreatePostModel isCreatePostModelOpen={isCreatePostModelOpen} setIsCreatePostModelOpen={setIsCreatePostModelOpen} />
      </Backdrop>
    </>
  );
});

Header.displayName = "Header";

export default Header;
