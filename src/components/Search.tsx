import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { ReceiptLongSharp, WidgetsSharp } from "@mui/icons-material";
import { test_SECONDARY_ACCENT_COLOR } from "../constants/color";
import { Tooltip } from "@mui/material";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

interface ISearchProps {
  onSearch: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue: string;
}

export default function Search(props: ISearchProps) {
  const { onSearch, onChange, searchValue } = props

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.code === "Enter") {
      onSearch()
    }
  }

  return (
    <Paper
    variant='outlined'
      sx={{
        p: "4px 4px",
        height: 38,
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        width: 500,
      }}
    >
      <InputBase
        value={searchValue}
        sx={{fontSize: 14, fontWeight: 400, ml: 1, flex: 1, color: test_SECONDARY_ACCENT_COLOR }}
        placeholder="Search Blocks / Transactions"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <Tooltip title="Explore Blocks, Verify Transactions">
        <SearchIcon
          sx={{mr: 2, color: test_SECONDARY_ACCENT_COLOR }}
          fontSize="small"
        />
      </Tooltip>
    </Paper>
  );
}
