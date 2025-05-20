// @ts-nocheck
import { alpha, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4F79A1", // Zcash Blue
      dark: "#1E2B4D",
      darker: "#0C1425",
      light: "#7FA3D0",
      lighter: "#BFD3E6"
    },
    secondary: {
      main: "#FFD700" //Zcash Gold
    },

    text: {
      primary: '#2A3439'
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableFocusRipple: true,
        disableRipple: true,
      },
      styleOverrides: {
        disableElevation: true,
        root: {

        },
        containedPrimary: {
          borderRadius: 999,
          backgroundColor: 'rgb(91, 148, 242)',
          textDecoration: 'none !important',
          fontSize: '0.7rem',
          fontWeight: '500'
        },
        textPrimary: {
     
        },
        outlinedPrimary: {
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          color: "#7FA3D0", // Zcash Blue for Tab text color
          textTransform: "none", // Make tab label lowercase
          backgroundColor: "#1E2B4D", // Darker background for tab label
          paddingBottom: "0px !important",
          borderBottom: "0px !important",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: "pointer",
          fontSize: 12,
          color: "#FFD700", // Zcash Gold for Links
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderColor: "#4F79A1", // Zcash Blue for table border
        },
        cell: {
          color: "#FFFFFF", // White for cell text
          fontSize: "14px", // Regular font size for cell content
        },
        head: {
          backgroundColor: "#1E2B4D", // Darker background for table header
          color: "#FFD700", // Zcash Gold text for table header
          fontSize: "16px", // Slightly larger font for headers
          fontWeight: "bold", // Bold font for headers for emphasis
        },
      },
    },
  },
});

export default theme;
