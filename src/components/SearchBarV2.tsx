import React from "react";
import { Paper, InputBase, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { test_SECONDARY_ACCENT_COLOR } from "../constants/color";

function SearchBarV2() {
  return (
    <Paper
      component="form"
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "2px 2px",
        width: 600,
        border: "1px solid #eee",
        height: 38,
        bgcolor: "#F3F6F9",
        borderRadius: 1, //4,
      }}
    >
      <InputBase
        sx={{
          marginLeft: 1,
          flex: 1,
          fontSize: "1rem",
          padding: "8px 16px",
        }}
        placeholder="Search block hash or transaction id:  "
        inputProps={{ "aria-label": "search" }}
      />
      <IconButton
        size="small"
        type="submit"
        sx={{
          padding: "10px",
          color: "rgba(0, 0, 0, 0.5)", // slightly dimmed color for the icon
        }}
        aria-label="search"
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}

export default SearchBarV2;
