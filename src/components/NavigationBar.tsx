
import React, { useEffect, useState } from "react";
import {
  Typography,
  Stack,
  AppBar,
  Toolbar,
  Container,
  IconButton,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import LinkGroup from "../containers/LinkGroup";
import { useTableSearch } from "../hooks/queries/useSearch";
import { directSearch } from "../constants/api-routes";
import Search from "./Search";
import { useRouter } from "next/router";
import { SiZcash } from "react-icons/si";

interface INavigationBarProps {
  pathname: string;
}

const NavigationBar = (props: INavigationBarProps) => {
  const { pathname } = props;
  const theme = useTheme()
  const [searchValue, setSearchValue] = React.useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onTableSearch = () => {
    directSearch(searchValue).then((response) => {
      if (
        typeof response == "object" &&
        Object.keys(response).includes("identifier") &&
        Object.keys(response).includes("source_table")
      ) {
        const { source_table, identifier } = response;
        switch (source_table) {
          case "blocks":
            window.open(`/block/${identifier}`);
            break;
          case "transactions":
            window.open(`/transaction/${identifier}`);
            break;
          default:
        }
      }
    });
  };

  return (
    <AppBar
      variant="elevation"

      elevation={0}
      sx={{
        display: { xs: "none", sm: "block" },
        px: 2,
        bgcolor: "#FAFAF8",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack spacing={3} direction="row" alignItems="center">
            <IconButton href='/'>
            <SiZcash style={{ color: theme.palette.secondary.main, width: 22, height: 22  }}  />
            </IconButton>

            <Typography sx={{ color: "#36454F " }} fontWeight="600">
              Zcash Block Explorer
            </Typography>
            <Search
              onChange={onChange}
              onSearch={onTableSearch}
              searchValue={searchValue}
            />
          </Stack>
          <LinkGroup pathname={pathname} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
