"use client";
import React from "react";
import { Box, Paper } from "@mui/material";
import "@/app/styles/mobile-frame.css";

interface AuthMobileFrameProps {
  children: React.ReactNode;
}

const AuthMobileFrame: React.FC<AuthMobileFrameProps> = ({ children }) => {
  return (
    <Box className="mobile-frame-container">
      <Paper className="mobile-frame" elevation={24}>
        {/* Screen Content */}
        <Box className="mobile-screen" sx={{ backgroundColor: "transparent" }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthMobileFrame; 