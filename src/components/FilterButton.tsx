import React from "react";
import { Button, Box, IconButton, SvgIconProps, ButtonProps, IconButtonProps, SvgIconTypeMap } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface IUiButtonProps extends ButtonProps {
  Icon: React.ElementType<SvgIconProps>;
}

interface IUiIconButtonProps extends IconButtonProps {

}

function UiButton(props: IUiButtonProps & IUiIconButtonProps) {
  const { onClick, size, Icon } = props

  return (
    <Box
      sx={{
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
        borderRadius: "50%", 
        overflow: "hidden", 
      }}
    >
      <IconButton
        onClick={onClick}
        size={size}
        sx={{
          textTransform: "none", 
          borderRadius: 999, 
          padding: "8px 8px", 
          fontSize: "1rem", 
          backgroundColor: "grey.100", 
          "&:hover": {
            backgroundColor: "grey.200", 
          },
        }}
      >
         {React.createElement(Icon, { style: { width: 15, height: 15 } })}
      </IconButton>
    </Box>
  );
}

export default UiButton
