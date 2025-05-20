import { styled, IconButton, Theme } from "@mui/material";

const StyledOutlinedIconButton = styled(IconButton)(({ theme }: { theme: Theme}) => {
    return {
        bgcolor: '#eee',
        border: '1px solid #eee'
    }
}) 

export { StyledOutlinedIconButton }