import { ContentCopyRounded, InfoOutlined } from "@mui/icons-material";
import { styled } from "@mui/material";

export const StyledCopyContentIcon = styled(ContentCopyRounded)(({ theme }) => {
    return {
      width: 16,
      height: 16,
      color: "text.secondary",
      cursor: "pointer",
    };
  });
  
  export const StyledInformationOutlinedIcon = styled(InfoOutlined)(({ theme }) => {
    return {
      width: 16,
      height: 16,
      color: "text.secondary",
      cursor: "pointer",
    };
  });

  