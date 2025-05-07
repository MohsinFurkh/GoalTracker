import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
      light: '#4791db',
      dark: '#115293',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6c3483', // Purple
      light: '#8c56a0',
      dark: '#4c2458',
      contrastText: '#fff',
    },
    success: {
      main: '#2ecc71', // Green
      light: '#58d68d',
      dark: '#239a55',
      contrastText: '#fff',
    },
    error: {
      main: '#e74c3c', // Red
      light: '#ec7063',
      dark: '#b03a2e',
      contrastText: '#fff',
    },
    warning: {
      main: '#f39c12', // Orange
      light: '#f6b044',
      dark: '#c87f0a',
      contrastText: '#fff',
    },
    info: {
      main: '#3498db', // Light Blue
      light: '#5faee3',
      dark: '#2874a6',
      contrastText: '#fff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.15),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.05)',
    '0px 3px 3px -2px rgba(0,0,0,0.15),0px 2px 3px 0px rgba(0,0,0,0.07),0px 1px 6px 0px rgba(0,0,0,0.05)',
    '0px 3px 4px -2px rgba(0,0,0,0.15),0px 3px 4px 0px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.05)',
    '0px 2px 5px -1px rgba(0,0,0,0.15),0px 4px 5px 0px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.05)',
    '0px 3px 6px -1px rgba(0,0,0,0.15),0px 5px 8px 0px rgba(0,0,0,0.07),0px 1px 14px 0px rgba(0,0,0,0.05)',
    '0px 3px 7px -2px rgba(0,0,0,0.15),0px 6px 10px 0px rgba(0,0,0,0.07),0px 1px 18px 0px rgba(0,0,0,0.05)',
    '0px 4px 8px -2px rgba(0,0,0,0.15),0px 7px 12px 1px rgba(0,0,0,0.07),0px 2px 16px 1px rgba(0,0,0,0.05)',
    '0px 5px 9px -3px rgba(0,0,0,0.15),0px 8px 14px 1px rgba(0,0,0,0.07),0px 3px 16px 2px rgba(0,0,0,0.05)',
    '0px 5px 10px -3px rgba(0,0,0,0.15),0px 9px 16px 1px rgba(0,0,0,0.07),0px 3px 16px 2px rgba(0,0,0,0.05)',
    '0px 6px 11px -3px rgba(0,0,0,0.15),0px 10px 18px 1px rgba(0,0,0,0.07),0px 4px 18px 3px rgba(0,0,0,0.05)',
    '0px 6px 12px -4px rgba(0,0,0,0.15),0px 11px 20px 1px rgba(0,0,0,0.07),0px 4px 20px 3px rgba(0,0,0,0.05)',
    '0px 7px 13px -4px rgba(0,0,0,0.15),0px 12px 22px 1px rgba(0,0,0,0.07),0px 5px 22px 4px rgba(0,0,0,0.05)',
    '0px 7px 14px -4px rgba(0,0,0,0.15),0px 13px 24px 1px rgba(0,0,0,0.07),0px 5px 24px 4px rgba(0,0,0,0.05)',
    '0px 8px 15px -5px rgba(0,0,0,0.15),0px 14px 26px 1px rgba(0,0,0,0.07),0px 6px 24px 5px rgba(0,0,0,0.05)',
    '0px 8px 16px -5px rgba(0,0,0,0.15),0px 15px 28px 1px rgba(0,0,0,0.07),0px 6px 26px 5px rgba(0,0,0,0.05)',
    '0px 8px 17px -5px rgba(0,0,0,0.15),0px 16px 30px 1px rgba(0,0,0,0.07),0px 7px 28px 6px rgba(0,0,0,0.05)',
    '0px 9px 18px -6px rgba(0,0,0,0.15),0px 17px 32px 1px rgba(0,0,0,0.07),0px 7px 30px 6px rgba(0,0,0,0.05)',
    '0px 9px 19px -6px rgba(0,0,0,0.15),0px 18px 34px 1px rgba(0,0,0,0.07),0px 8px 32px 7px rgba(0,0,0,0.05)',
    '0px 10px 20px -6px rgba(0,0,0,0.15),0px 19px 36px 1px rgba(0,0,0,0.07),0px 8px 34px 7px rgba(0,0,0,0.05)',
    '0px 10px 21px -7px rgba(0,0,0,0.15),0px 20px 38px 1px rgba(0,0,0,0.07),0px 9px 36px 8px rgba(0,0,0,0.05)',
    '0px 10px 22px -7px rgba(0,0,0,0.15),0px 21px 40px 1px rgba(0,0,0,0.07),0px 9px 38px 8px rgba(0,0,0,0.05)',
    '0px 11px 23px -7px rgba(0,0,0,0.15),0px 22px 42px 1px rgba(0,0,0,0.07),0px 10px 40px 9px rgba(0,0,0,0.05)',
    '0px 11px 24px -8px rgba(0,0,0,0.15),0px 23px 44px 2px rgba(0,0,0,0.07),0px 10px 42px 9px rgba(0,0,0,0.05)',
    '0px 11px 25px -8px rgba(0,0,0,0.15),0px 24px 46px 2px rgba(0,0,0,0.07),0px 11px 44px 10px rgba(0,0,0,0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 5px 25px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
  },
});

export default theme; 