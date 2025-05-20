import { Noto_Sans } from "next/font/google";
import NavigationBar from "./NavigationBar";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { Box, Card, CardContent, Typography } from '@mui/material'
import { useEffect } from "react";

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Layout({ children }) {
  return (
    <>
      <main className={`${styles.main} ${noto.className}`}>{children}</main>
    </>
  );
}
