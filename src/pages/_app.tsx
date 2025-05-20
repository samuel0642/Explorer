import "../styles/globals.css";
import "react-virtualized/styles.css";

import React from "react";
import queryClient from "../../query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../mui_theme";
import { Noto_Sans } from "next/font/google";
import { GlobalSnackbar } from "../components/AlertSnackbar";
import NavigationBar from "../components/NavigationBar";
import { useRouter } from "next/router";
import useBlockchainInfo from "../hooks/queries/useBlockchainInfo";
import usePeerInfo from "../hooks/queries/usePeerInfo";
import Footer from "../components/Footer";

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function App({ Component, pageProps }) {
   const router = useRouter()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <main className={noto.className}>
        <NavigationBar pathname={router.pathname} />
          <Component {...pageProps} />
          <GlobalSnackbar />
        </main>
        <CssBaseline />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
