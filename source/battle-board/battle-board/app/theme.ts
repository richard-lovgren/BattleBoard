'use client';
import { createTheme } from '@mui/material/styles';

/* Material UI Custom Theme based on dark mode */
const theme = createTheme({
    cssVariables: true,
    palette: {
        mode: 'dark',
        primary: {
            main: '#765DEA',
            light: '#9884f5',
            dark: '#4E35BE',
        },
        background: {
            default: '#0E0030',
            paper: '#0E0030',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#9884f5',
        },
        divider: '#FFFFFF',
        action: {
            active: '#FFFFFF',
            hover: '#9884f5',
            selected: '#765DEA',
            disabled: '#4E35BE',
            disabledBackground: '#0E0030',
        },
    },
    typography: {
        fontFamily: 'var(--font-nunito-sans)',
    },

  });

export default theme;