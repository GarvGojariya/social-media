"use client"
import Loader from '@/app/component/Loader'
import { API } from '@/app/lib/axios'
import { frame1 } from '@/assets/images'
import { Backdrop, Box, Button, CircularProgress, CssBaseline, Typography } from '@mui/material'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const Page = ({ params }: any) => {
    const [iv, encryptedData] = params.slug
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()

    const verify = async () => {
        setLoading(true)
        try {
            const res = await API.post("/api/user/verify", { iv, encryptedData })
            console.log(res)
            setLoading(false)
            router.push("/login")
            toast.success(res.data.message ?? "Verification successfull please login.")
        } catch (error:any) {
            console.log(error)
            setLoading(false)
            toast.error(error?.response?.data?.message?? "Verification failed please try again.")
            router.push("/verify")
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
                    <Loader/>
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
                    <Typography component="h1" variant="h5">
                        Welcome
                    </Typography>
                    <Typography component="h2" variant="h5">
                        Please click here to verify your account.
                    </Typography>
                    <Button onClick={verify}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Verify
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default Page
