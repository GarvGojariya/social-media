"use client";
import {
  Avatar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Skeleton,
} from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import HomeIcon from "@/assets/icons/homeIcon.svg";
import SaveIcon from "@/assets/icons/saveIcon.svg";
import HeartIcon from "@/assets/icons/heartIcon.svg";
import SettingIcon from "@/assets/icons/settingIcon.svg";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getCurrentUserData } from "../../../utils/globalHelpers/globalHelpers";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSession } from "next-auth/react";

interface navLink {
  id: string;
  name: string;
  link: string;
  icon: ReactElement;
}

interface UserData {
  id: string;
  name: string;
  profileImage: string;
  userName: string;
}

const BottomAppBar = () => {
  const router = useRouter();
  const { data } = useSession();

  const [value, setValue] = useState(0);
  const [profileData, setProfileData] = useState<UserData>({} as UserData);
  const [loading, setLoading] = useState<boolean>(true);

  const navLinks: navLink[] = [
    {
      id: "home",
      name: "Home",
      link: "/",
      icon: <HomeIcon />,
    },
    // {
    //   id: "save",
    //   name: "Saved",
    //   link: "/saved-posts",
    //   icon: <SaveIcon />,
    // },
    {
      id: "search",
      name: "Search",
      link: "/search",
      icon: <SearchRoundedIcon />,
    },
    {
      id: "notifications",
      name: "Notifications",
      link: "/notifications",
      icon: <HeartIcon />,
    },
    {
      id: "settings",
      name: "Settings",
      link: "/settings",
      icon: <SettingIcon />,
    },
  ];

  useEffect(() => {
    // fetchData();
    // (async () => {
    //   const ddddd = await callInternalApi();
    //   console.log("🚀 ~ ddddd:", ddddd);
    // })();
    (async () => {
      if (data?.user) {
        await setProfileData(data.user as UserData);
        setLoading(false);
      }
    })();
  }, [data]);

  const handleNavChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push(navLinks[newValue].link);
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  return (
    <>
      <Paper
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
        elevation={3}
        id="bottom-app-bar"
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleNavChange}
          sx={{
            height: "60px",
            borderTop: "1px solid #cfcfcf",
            backgroundColor: "#fff",
          }}
        >
          {navLinks.slice(0, 3).map((link, index) => (
            <BottomNavigationAction
              key={link.id}
              // label={link.name}
              icon={link.icon}
            />
          ))}
          {loading ? (
            <BottomNavigationAction
              // label="Profile"
              icon={<Skeleton variant="circular"/>}
            />
          ) : (
            <BottomNavigationAction
              // label="Profile"
              icon={
                <Avatar
                  src={profileData.profileImage}
                  alt={profileData.name}
                  sx={{ width: 36, height: 36 }}
                />
              }
              onClick={goToProfile}
            />
          )}
        </BottomNavigation>
      </Paper>

      {/* <Box sx={{ pb: "64px" }} /> */}
    </>
  );
};

BottomAppBar.displayName = "BottomAppBar";

export default BottomAppBar;
