import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase"
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function CustomizedInputBase() {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      component="form"
      sx={{
        borderRadius: 2,
        p: "0px 10px",
        display: "flex",
        height: 35,
        border: "none",
        bgcolor: "rgb(244, 246, 249)",
        alignItems: "center",
        width: 700,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: 14 }}
        placeholder="Search Block Hash / Transactions ID"
        inputProps={{ "aria-label": "search google maps" }}
      />
      <IconButton
        size="small"
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}
