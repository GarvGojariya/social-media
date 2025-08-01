"use client";
import React from "react";
import { Box, Paper } from "@mui/material";
import "@/app/styles/mobile-frame.css";

interface MobileFrameProps {
  children: React.ReactNode;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <Box className="mobile-frame-container">
      <Paper className="mobile-frame" elevation={24}>
        {/* Screen Content */}
        <Box className="mobile-screen">
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default MobileFrame; 