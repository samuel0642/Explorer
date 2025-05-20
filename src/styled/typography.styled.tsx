import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { Theme } from "@mui/material";
import mui_theme from "../mui_theme";
const StyledBodyTableTypography = styled(Typography)(
  ({ theme = mui_theme }: { theme?: Theme }) => ({
    fontSize: '0.89rem',

    color: "text.secondary"
  })
);

const ListItemDetailHeaderTypography = styled(Typography)(
  ({ theme = mui_theme }: { theme?: Theme }) => ({

  })
);

const ListItemDetailSecondaryTypography = styled(Typography)(
  ({ theme = mui_theme }: { theme?: Theme }) => ({
  })
);

export { StyledBodyTableTypography, ListItemDetailHeaderTypography, ListItemDetailSecondaryTypography };
