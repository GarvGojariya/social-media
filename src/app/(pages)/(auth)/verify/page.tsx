"use client"
import Loader from '@/app/components/Loader'
import { API } from '@/app/lib/axios'
import { frame1 } from '@/assets/images'
import { Backdrop, Box, Button, CssBaseline, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const Page = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        try {
            const res = await API.post("/api/user/send-verify-link", { email: email })
            console.log(res)
            setLoading(false)
            setEmail("")
            toast.success(res.data.message ?? "Verification successfull please login.")
        } catch (error: any) {
            console.log(error)
            setLoading(false)
            setEmail("")
            toast.error(error?.response?.data?.message ?? "Verification failed please try again.")
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: "center",
                maxWidth: "100%",
                height: "100vh",
                backgroundImage: `url(${frame1.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}>
            <CssBaseline />
            <Backdrop
                sx={{ color: '#fff', zIndex: 10 }}
                open={loading}
            >
                <Loader />
            </Backdrop>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: "24px",
                    padding: "24px",
                    maxWidth: "400px",
                    background: "rgb(74 168 255 / 12%)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(7.1px)",
                    border: "3px solid rgb(151 180 207 / 24%)"
                }}
            >
                {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar> */}
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Username or Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2, color: "#121212" }}
                        fullWidth
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Page
