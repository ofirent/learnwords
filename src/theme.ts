import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: { main: '#4da3ff' },
    background: {
      default: '#0b0b10',
      paper: '#13131a',
    },
    text: {
      primary: '#eaeaf0',
      secondary: '#9aa0a6',
    },
    divider: '#232334',
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'Heebo, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { border: '1px solid #232334' }}},
    MuiButton: { styleOverrides: { root: { textTransform: 'none' }}},
    MuiTextField: { styleOverrides: { root: {}}},
  }
})
