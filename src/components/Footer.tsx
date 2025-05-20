import React from "react";
import {
  IconButton,
  Typography,
  Divider,
  Stack,
  Box,
  Link,
} from "@mui/material";
import { GitHub } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        paddingLeft: "5rem",
        maxHeight: 60,
        paddingRight: "5rem",

        paddingTop: "1rem",
        zIndex: 1000,
 
        backgroundColor: "#f2f2f2",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={2} alignItems="center">
        

          <Typography color="text.primary" variant='body2'>
            A Zcash Block Explorer - No trackers
          </Typography>
          <Link
            href="https://github.com/elijahhampton/blockexplorer_ui"
            target="_blank"
            rel="noopener"
          >
            <IconButton size='small'>
              <GitHub fontSize='small' />
            </IconButton>
          </Link>
        </Stack>

          <Typography color="black" variant="body2">
            Explore block, transaction and addresses
          </Typography>



      </Stack>

      <Divider sx={{ mt: 2 }} />
    </footer>
  );
};

export default Footer;
