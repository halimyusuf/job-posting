import { createTheme } from '@mui/material/styles';

// Modernized theme: subtle gradients, cleaner shadows, refined spacing and typography
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7c3aed',
      contrastText: '#fff',
    },
    background: {
      default: '#f6f8fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, Roboto, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", Arial',
    h1: { fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.75rem' },
    h3: { fontWeight: 600, fontSize: '1.375rem' },
    h4: { fontWeight: 600, fontSize: '1.125rem' },
    body1: { fontSize: '0.98rem', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shadows: [
    'none',
    '0 1px 2px rgba(15, 23, 42, 0.04)',
    '0 2px 6px rgba(15, 23, 42, 0.06)',
    '0 4px 12px rgba(15, 23, 42, 0.08)',
    '0 8px 24px rgba(15, 23, 42, 0.10)',
    '0 12px 40px rgba(15, 23, 42, 0.12)',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(246,248,251,0.6))',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 18px',
        },
        containedPrimary: {
          boxShadow: '0 6px 18px rgba(37,99,235,0.12)',
        },
        outlined: {
          borderWidth: 1,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundClip: 'padding-box',
        },
        elevation1: {
          boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
        },
        elevation2: {
          boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
          transition: 'transform 180ms ease, box-shadow 180ms ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(15,23,42,0.08)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(37,99,235,0.22)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(37,99,235,0.32)',
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, rgba(37,99,235,1) 0%, rgba(124,58,237,0.92) 100%)',
          color: '#fff',
          boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(124,58,237,0.08)',
          color: '#7c3aed',
        },
      },
    },
  },
});
