// GlobalSnackbar.tsx
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useSnackbarManager } from '../utility/snackbar_manager';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const GlobalSnackbar = () => {
  const { snackbarConfig, closeSnackbar } = useSnackbarManager();

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={!!snackbarConfig}
      autoHideDuration={snackbarConfig?.duration || 3000}
      onClose={closeSnackbar}
    >
      {snackbarConfig && (
        <Alert onClose={closeSnackbar} severity={snackbarConfig.variant}>
          {snackbarConfig.message}
        </Alert>
      )}
    </Snackbar>
  );
};
