"use client"
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Sidebar from '../../component/Sidebar'
import { Box, createTheme, outlinedInputClasses, ThemeProvider, CssBaseline } from '@mui/material'
import "@/app/globals.css"
import RightSidebar from '@/app/component/RightSidebar'
import Header from '@/app/component/Header'

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 12,
                    fontWeight: 600,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                    },
                },
                contained: {
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease-in-out',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '--TextField-brandBorderColor': '#e0e0e0',
                    '--TextField-brandBorderHoverColor': '#bdbdbd',
                    '--TextField-brandBorderFocusedColor': '#1976d2',
                    '& label.Mui-focused': {
                        color: '#1976d2',
                    },
                    '& label': {
                        color: '#757575',
                    },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: 'var(--TextField-brandBorderColor)',
                },
                root: {
                    [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: 'var(--TextField-brandBorderHoverColor)',
                    },
                    [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: 'var(--TextField-brandBorderFocusedColor)',
                    },
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    '&::before, &::after': {
                        borderBottom: '2px solid var(--TextField-brandBorderColor)',
                    },
                    '&:hover:not(.Mui-disabled, .Mui-error):before': {
                        borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
                    },
                    '&.Mui-focused:after': {
                        borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    '&::before': {
                        borderBottom: '1px solid #666',
                    },
                    '&:hover': {
                        borderBottom: '1px solid #777',
                    },
                    '&:hover:not(.Mui-disabled, .Mui-error):before': {
                        borderBottom: 'unset',
                    },
                    '&.Mui-focused:after': {
                        borderBottom: '1px solid #141414',
                    },
                },
            },
        },
    },
})

const Layout = ({ children }: { children: ReactNode }) => {

    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                display: 'flex',
                backgroundColor: theme.palette.background.default,
                width: "100%",
                minHeight: "100vh"
            }}>
                <Sidebar />
                <Box sx={{
                    display: 'flex',
                    flexDirection: "column",
                    width: "100%"
                }}>
                    <Header ref={headerRef} key="header" />
                    <Box sx={{
                        display: 'flex',
                        width: "100%",
                        minHeight: `calc(100vh - ${headerHeight}px)`
                    }}>
                        {children}
                        <RightSidebar />
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Layout
