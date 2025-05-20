import { Card, Theme } from "@mui/material";
import { styled } from "@mui/styles";

const StyledCard = styled(Card)(({ theme }: { theme: Theme }) => ({
    borderRadius: 5,
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
  }));
  
export { StyledCard }