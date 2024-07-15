"use client"
import { Box, Button, CssBaseline, Grid, IconButton, InputAdornment, InputLabel, Link, TextField, Typography, Backdrop, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { frame1 } from '@/assets/images';
import { CldUploadWidget } from 'next-cloudinary';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { API } from '@/app/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';

interface SignUpData {
    email: string;
    password: string;
    name: string;
    userName: string;
    birthDate: string;
    bio: string;
}

const page = () => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [signUpData, setSignUpData] = useState<SignUpData>({
        email: "",
        password: "",
        name: "",
        userName: "",
        birthDate: "",
        bio: "",
    })
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        event.preventDefault();
        try {
            const response: any = await API.post("/api/user/signup", {
                ...signUpData,
                profileImage: uploadedImageUrl
            })
            await setSignUpData({
                email: "",
                password: "",
                name: "",
                userName: "",
                birthDate: "",
                bio: "",
            })
            setUploadedImageUrl("")
            console.log(response)
            setLoading(false)
            router.push("/login")
            toast.success(response.data?.message ?? "Signup successfully please check mail to verify your account.");
        } catch (error: any) {
            await setSignUpData({
                email: "",
                password: "",
                name: "",
                userName: "",
                birthDate: "",
                bio: "",
            })
            console.log(error)
            setUploadedImageUrl("")
            setLoading(false)
            toast.error(error.response.data.message ?? "Signup failed");
        }
    }

    return (
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
                    Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{
                            display: "flex",
                            justifyContent: "center",
                            "& img": {
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                border: "2px solid #2b7dc9"
                            }
                        }}>
                            {uploadedImageUrl ? (
                                <img src={uploadedImageUrl} alt="Uploaded Image" />
                            ) : (
                                <CldUploadWidget
                                    signatureEndpoint="/api/sign-cloudinary-params"
                                    onSuccess={(result: any, { widget }) => {
                                        setUploadedImageUrl(result?.info?.url);
                                        widget.close();
                                    }}
                                    onError={(error) => console.log("Upload Error:", error)}
                                >
                                    {({ open }) => (
                                        <AddPhotoAlternateIcon
                                            onClick={() => open()}
                                            sx={{
                                                color: "whitesmoke",
                                                height: "60px",
                                                width: "80px",
                                                "&:hover": {
                                                    color: "#75bdff",
                                                },
                                                justifySelf: "center",
                                                cursor: "pointer"
                                            }}
                                        />
                                    )}
                                </CldUploadWidget>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                onChange={(e) => setSignUpData({
                                    ...signUpData,
                                    name: e.target.value
                                })}
                                value={signUpData.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="User Name"
                                name="username"
                                autoComplete="family-name"
                                onChange={(e) => setSignUpData({
                                    ...signUpData,
                                    userName: e.target.value
                                })}
                                value={signUpData.userName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => setSignUpData({
                                    ...signUpData,
                                    email: e.target.value
                                })}
                                value={signUpData.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={isPasswordVisible ? "text" : "password"}
                                id="password"
                                autoComplete="new-password"
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
                                onChange={(e) => setSignUpData({
                                    ...signUpData,
                                    password: e.target.value
                                })}
                                value={signUpData.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={3}
                                id="bio"
                                label="Bio"
                                name="bio"
                                autoComplete="bio"
                                onChange={(e) => setSignUpData({
                                    ...signUpData,
                                    bio: e.target.value
                                })}
                                value={signUpData.bio}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel htmlFor='birthdate' >Birth Date</InputLabel>
                            <TextField
                                required
                                fullWidth
                                name="birthdate"
                                // label="Birth Date"
                                type="date"
                                id="birthdate"
                                // onChange={(e)=>setBirthDate(e.target.value)}
                                onChange={(e) => setSignUpData({
                                    ...signUpData,
                                    birthDate: e.target.value
                                })}
                                value={signUpData.birthDate}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default page
