// SnackbarManager.ts
import { useState } from 'react';

type SnackbarVariant = 'error' | 'warning' | 'info' | 'success';

interface SnackbarConfig {
  message: string;
  variant: SnackbarVariant;
  duration?: number;
}

let openSnackbarFn: (config: SnackbarConfig) => void;

export const useSnackbarManager = () => {
  const [snackbarConfig, setSnackbarConfig] = useState<SnackbarConfig | null>(null);

  const openSnackbar = (config: SnackbarConfig) => {
    setSnackbarConfig(config);
  };

  openSnackbarFn = openSnackbar;

  const closeSnackbar = () => {
    setSnackbarConfig(null);
  };

  return { snackbarConfig, closeSnackbar };
};

export const openSnackbar = (config: SnackbarConfig) => {
  if (openSnackbarFn) {
    openSnackbarFn(config);
  }
};
