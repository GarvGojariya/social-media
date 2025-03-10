"use client";
import React, { useState, ChangeEvent } from "react";
import {
  TextField,
  InputAdornment,
  List,
  ListItem,
  CircularProgress,
  Box,
  Typography,
  Avatar,
  Card,
  CardHeader,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { searchUser } from "@/app/actions/userActions";
import UserCard from "@/app/component/UserCard";
import { User } from "../../../../../types/globalTypes";
import Link from "next/link";

const SearchPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Handle input change
  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (!query.trim()) {
      setFilteredUsers([]);
      return;
    }

    setLoading(true);
    const res = await searchUser(query);
    setFilteredUsers(res.success ? res.users : []);
    setLoading(false);
  };

  return (
    <Box sx={{ width: "100%", mx: "auto" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "gray" }} />
            </InputAdornment>
          ),
        }}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!loading && filteredUsers.length > 0 ? (
        <List sx={{ mt: 2 }}>
          {filteredUsers.map((user) => (
            <ListItem key={user.id}>
              <Link href={`/profile/${user.id}`} style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    borderBottom: "1px solid #eeeeee",
                    backgroundColor: "white",
                    margin: 0,
                    boxShadow: "unset",
                    borderRadius: "0",
                    cursor: "pointer",
                    overflow: "visible",
                    "&: last-child": {
                      borderBottom: "unset",
                    },
                  }}
                >
                  <CardHeader
                    sx={{
                      "& img": {
                        height: "100%",
                        width: "100%",
                      },
                      width: "100%",
                    }}
                    avatar={
                      <Avatar aria-label="recipe">
                        <img src={user.profileImage} alt="User Image" />
                      </Avatar>
                    }
                    title={
                      <Typography variant="body2" color="black">
                        {user.userName}
                      </Typography>
                    }
                    subheader={
                      <Typography variant="body2" color="#777">
                        {user.name}
                      </Typography>
                    }
                  />
                </Card>
              </Link>
            </ListItem>
          ))}
        </List>
      ) : (
        !loading &&
        searchTerm.trim() && (
          <Typography sx={{ mt: 2, textAlign: "center", color: "gray" }}>
            No users found.
          </Typography>
        )
      )}
    </Box>
  );
};

export default SearchPage;
