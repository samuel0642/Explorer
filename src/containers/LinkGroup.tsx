import React, { useEffect, useState } from "react";
import {
  Stack,
  Link,
  Typography,
  Button,
  Popover,
  SxProps,
  Menu,
  MenuItem,
  Divider,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  ReceiptLong,
  RemoveRedEye,
  TravelExplore,
  ViewModule,
} from "@mui/icons-material";
import { SiStackblitz } from "react-icons/si";

const commonTypographyProps = (currentUrl, focusedUrl): SxProps => ({
  fontSize: 13,
  cursor: "pointer",
  textTransform: "none !important",
  textDecoration: "none !important",
  color: currentUrl === focusedUrl ?  "#DAA520" : "#111",
  borderRadius: "4px", 
  padding: "6px 12px", 
  "&:hover": {
    color: "#DAA520", 
  },
  "&:focus": {
    outline: "none",
    boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)", 
  },
  "&:active": {
    color: "primary.light", 
  },
})

const LinkGroup = ({ pathname}: { pathname: string;}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <Stack spacing={3} direction="row" alignItems="center">
      <Stack direction="row" alignItems="center">
        <TravelExplore fontSize="small" sx={{ color: "black" }} />
        <Link
          href="/"
          style={{
            textDecoration: "none !important",
            textTransform: 'none'
          }}
        >
          <Typography
            sx={{
              ...commonTypographyProps("/", pathname),
            }}
          >
            Explore
          </Typography>
        </Link>
      </Stack>

      <Stack direction="row" alignItems="center">
        <ViewModule fontSize="small" sx={{ color: "black" }} />
        <Link
          href="/blocks"
          style={{
            textDecoration: "none !important",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              ...commonTypographyProps("/blocks", pathname),
            }}
          >
            Blocks
          </Typography>
        </Link>
      </Stack>

      <Stack direction="row" alignItems="center">
        <ReceiptLong fontSize="small" sx={{ color: "black" }} />
        <Link
          href="/transactions"
          style={{ textDecoration: "none !important" }}
        >
          <Typography
            sx={{
              ...commonTypographyProps("/transactions", pathname),
            }}
          >
            Transactions
          </Typography>
        </Link>
      </Stack>

      <Button
        disabled={true}
        onClick={handleClick}
        startIcon={<SiStackblitz style={{ width: 15, height: 15}} />}
        sx={{color: "rgb(55, 131, 190)", fontWeight: "600", textTransform: "none" }}
        variant="text"
      >
        <Typography variant='body2' fontSize={13}>
          Switch to mainnet (coming soon)
        </Typography>
      </Button>
    </Stack>
  );
};

export default LinkGroup;
