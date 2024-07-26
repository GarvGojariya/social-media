"use client"
import Loader from '@/app/component/Loader'
import { API } from '@/app/lib/axios'
import { frame1 } from '@/assets/images'
import { Backdrop, Box, Button, CssBaseline, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Page = ({ params }: any) => {
    const [iv, encryptedData] = params.slug
    const [loading, setLoading] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false)
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        try {
            const res = await API.post("/api/user/reset-password", { iv, encryptedData, password, confirmPassword })
            console.log(res)
            setLoading(false)
            router.push("/login")
            toast.success(res.data.message ?? "Password reset successfull please login.")
        } catch (error: any) {
            console.log(error)
            setLoading(false)
            toast.error(error?.response?.data?.message ?? "Password reset failed please try again.")
            router.push("/login")
        }
    }

    return (
        <>
            <Box sx={{
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
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    <IconButton onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        {isPasswordVisible ?
                                            <VisibilityIcon sx={{
                                                color: "whitesmoke",
                                            }} />
                                            :
                                            <VisibilityOffIcon sx={{
                                                color: "whitesmoke",
                                            }} />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirm-password"
                            label="Confirm Password"
                            type="confirm-password"
                            id="confirm-password"
                            autoComplete="current-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    <IconButton onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                        {isConfirmPasswordVisible ?
                                            <VisibilityIcon sx={{
                                                color: "whitesmoke",
                                            }} />
                                            :
                                            <VisibilityOffIcon sx={{
                                                color: "whitesmoke",
                                            }} />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2, color: "#121212" }}
                            fullWidth
                        >
                            Reset
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Page
