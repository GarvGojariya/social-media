"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Sidebar from "../../component/Sidebar";
import {
  Box,
  Container,
  createTheme,
  outlinedInputClasses,
  ThemeProvider,
} from "@mui/material";
import "@/app/globals.css";
import RightSidebar from "@/app/component/RightSidebar";
import Header from "@/app/component/Header";
import BottomAppBar from "@/app/component/BottomAppBar";
import MobileFrame from "@/app/component/MobileFrame";

export const theme = createTheme({
  palette: {
    mode: "light",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "--TextField-brandBorderColor": "#E0E3E7",
          "--TextField-brandBorderHoverColor": "#B2BAC2",
          "--TextField-brandBorderFocusedColor": "rgb(194 225 255)",
          "& label.Mui-focused": {
            color: "black",
          },
          "& label": {
            color: "black",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "var(--TextField-brandBorderColor)",
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--TextField-brandBorderHoverColor)",
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          "&::before, &::after": {
            borderBottom: "2px solid var(--TextField-brandBorderColor)",
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
          },
          "&.Mui-focused:after": {
            borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&::before": {
            borderBottom: "1px solid #666",
          },
          "&:hover": {
            borderBottom: "1px solid #777",
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "unset",
          },
          "&.Mui-focused:after": {
            borderBottom: "1px solid #141414",
          },
        },
      },
    },
  },
});

const Layout = ({ children }: { children: ReactNode }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  let bottomBarHeight = 60;
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    bottomBarHeight =
      document.getElementById("bottom-app-bar")?.clientHeight ?? 60;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <MobileFrame>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "white",
          }}
        >
          <Header ref={headerRef} key="header" />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: `calc(100% - ${headerHeight + bottomBarHeight}px)`,
              overflow: "auto",
            }}
          >
            {children}
          </Box>
          <BottomAppBar />
        </Box>
      </MobileFrame>
    </ThemeProvider>
  );
};

export default Layout;
