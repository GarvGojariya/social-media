/* eslint-disable @next/next/no-img-element */
import { Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material'
import { CldUploadWidget } from 'next-cloudinary';
import React, { Dispatch, SetStateAction, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { API } from '../lib/axios';
import toast from 'react-hot-toast';

interface CreatePostProps {
    setIsCreatePostModelOpen: Dispatch<SetStateAction<boolean>>
}

const CreatePostModel = ({
    setIsCreatePostModelOpen
}: CreatePostProps) => {

    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
    const [captionText, setCaptionText] = useState("")
    const [loading, setLoading] = useState<boolean>(true)

    const createPost = async () => {
        setLoading(true)
        try {
            const res = await API.post("/api/post/create-post", {
                url: uploadedImageUrl,
                caption: captionText
            })
            console.log(res)
            setLoading(false)
            setIsCreatePostModelOpen(false)
            toast.success(res.data.message ?? "Email sent successfull please check.")
            setUploadedImageUrl("")
            setCaptionText("")
        } catch (error: any) {
            console.log(error)
            setLoading(false)
            toast.error(error?.response?.data?.message ?? "Failed to Create post. please try again.")
            setUploadedImageUrl("")
            setCaptionText("")
        }
    }

    return (
        <Paper elevation={20} sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "600px",
            maxHeight: "700px",
            padding: "38px",
            borderRadius: "16px"
        }}>
            <IconButton
                sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                }}
                onClick={() => {
                    setIsCreatePostModelOpen(false)
                    setUploadedImageUrl("")
                    setCaptionText("")
                }}>
                <CancelRoundedIcon />
            </IconButton>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px"
            }}>
                <Typography sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                }}>Create Post</Typography>
                <Box sx={{
                    display: "flex",
                }}>
                    {uploadedImageUrl ? (
                        <img src={uploadedImageUrl} alt="Uploaded Image" style={{
                            width: "100%",
                        }} />
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
                                        color: "#000000",
                                        height: "100px",
                                        width: "100px",
                                        "&:hover": {
                                            color: "#777",
                                        },
                                        justifySelf: "center",
                                        cursor: "pointer"
                                    }}
                                />
                            )}
                        </CldUploadWidget>
                    )}
                </Box>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Caption"
                    multiline
                    style={{ width: "100%" }}
                    variant='outlined'
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    required
                />
                <Button variant='contained' sx={{
                    color: "white",
                    backgroundColor: "#000000",
                    borderRadius: "12px",
                    textTransform: "capitalize",
                    "&:hover": {
                        backgroundColor: "#777",
                    }
                }}
                    onClick={createPost}
                >Create</Button>
            </Box>
        </Paper>
    )
}

export default CreatePostModel
