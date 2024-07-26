"use client"
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Sidebar from '../../component/Sidebar'
import { Box, createTheme, outlinedInputClasses, ThemeProvider } from '@mui/material'
import "@/app/globals.css"
import RightSidebar from '@/app/component/RightSidebar'
import Header from '@/app/component/Header'

export const theme = createTheme({
    palette: {
        mode: 'light',
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '--TextField-brandBorderColor': '#E0E3E7',
                    '--TextField-brandBorderHoverColor': '#B2BAC2',
                    '--TextField-brandBorderFocusedColor': 'rgb(194 225 255)',
                    '& label.Mui-focused': {
                        color: 'black',
                    },
                    '& label': {
                        color: 'black',
                    }
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
            <Box sx={{
                display: 'flex',
                backgroundColor: "#f7f7f7",
                width: "100%",
                height: "100vh"
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
                        height: `calc(100% - ${headerHeight}px)`
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
