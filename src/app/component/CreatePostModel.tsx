/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { CldUploadWidget } from "next-cloudinary";
import React, { Dispatch, SetStateAction, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { API } from "../lib/axios";
import toast from "react-hot-toast";

interface CreatePostProps {
  setIsCreatePostModelOpen: Dispatch<SetStateAction<boolean>>;
  isCreatePostModelOpen: boolean;
}

const CreatePostModel = ({
  setIsCreatePostModelOpen,
  isCreatePostModelOpen,
}: CreatePostProps) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [captionText, setCaptionText] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const createPost = async () => {
    setLoading(true);
    try {
      const res = await API.post("/api/post/create-post", {
        url: uploadedImageUrl,
        caption: captionText,
      });
      console.log(res);
      toast.success(res.data.message ?? "Post created successfully!");
      handleClose();
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ??
          "Failed to create post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsCreatePostModelOpen(false);
    setUploadedImageUrl("");
    setCaptionText("");
  };

  return (
    <Dialog
      open={isCreatePostModelOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Create Post
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {uploadedImageUrl ? (
            <img
              src={uploadedImageUrl}
              alt="Uploaded"
              style={{ width: "100%" }}
            />
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
                    color: "#000",
                    height: "100px",
                    width: "100px",
                    cursor: "pointer",
                    "&:hover": { color: "#777" },
                  }}
                />
              )}
            </CldUploadWidget>
          )}
          <TextField
            label="Caption"
            multiline
            fullWidth
            variant="outlined"
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleClose} color="secondary">
          Cancel
        </Button> */}
        <Button
          onClick={createPost}
          variant="contained"
          disabled={loading}
          sx={{ backgroundColor: "#000", color: "#fff" }}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostModel;
