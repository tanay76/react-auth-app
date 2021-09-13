import { createTheme } from "@material-ui/core";


export const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#b57b3f',
    },
    secondary: {
      main: '#750606',
    },
    error: {
      main: '#f50909',
    },
    warning: {
      main: '#f17509',
    },
    success: {
      main: '#10bf16',
    },
  },
  typography: {
    fontFamily: 'Lato',
  },  
  shape: {
    borderRadius: 10,
  },
});