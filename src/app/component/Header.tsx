"use client";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Backdrop,
  Avatar,
  Chip,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { SearchRounded } from "@mui/icons-material";
import toast from "react-hot-toast";
import { API } from "../lib/axios";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useRouter } from "next/navigation";
import CreatePostModel from "./CreatePostModel";
import { styled } from "@mui/material/styles";

interface UserData {
  id: string;
  name: string;
  profileImage: string;
  userName: string;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  color: theme.palette.text.primary,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const Header = forwardRef<HTMLDivElement>((props, ref) => {
  const [profileData, setProfileData] = useState<UserData>({} as UserData);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchName, setSearchName] = useState("");
  const [isCreatePostModelOpen, setIsCreatePostModelOpen] =
    useState<boolean>(false);

  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await API.get("/api/user/get-current-user");
      setProfileData(response.data.user);
      setLoading(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ??
          "Something  went wrong while fetching user data"
      );
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await API.get("/api/user/logout");
      toast.success(response.data.message ?? "Logged out successfully.");
      router.push("/login");
      setLoading(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ?? "Something  went wrong while logout."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <StyledAppBar
        position="sticky"
        ref={ref}
        elevation={0}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, sm: 4 },
            py: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={profileData.profileImage}
              alt={profileData.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                Welcome back!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileData.name}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <StyledTextField
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search users..."
              sx={{
                minWidth: 280,
                '& .MuiOutlinedInput-root': {
                  height: 40,
                },
              }}
            />
            
            <Button
              variant="contained"
              startIcon={<AddBoxOutlinedIcon />}
              onClick={() => setIsCreatePostModelOpen(true)}
              sx={{
                minWidth: 140,
                height: 40,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                },
              }}
            >
              New Post
            </Button>
            
            <IconButton
              onClick={logout}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <LogoutRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
      
      <Backdrop
        sx={{
          zIndex: "2",
        }}
        open={isCreatePostModelOpen}
      >
        <CreatePostModel setIsCreatePostModelOpen={setIsCreatePostModelOpen} />
      </Backdrop>
    </>
  );
});

Header.displayName = "Header";

export default Header;
