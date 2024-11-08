import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { deDE } from "@mui/x-data-grid/locales";

export const redAccent = {
  100: "#f4d3d4",
  200: "#e9a7a8",
  300: "#dd7c7d",
  400: "#d25051",
  500: "#c72426",
  600: "#9f1d1e",
  700: "#771617",
  800: "#500e0f",
  900: "#280708",
};

const theme = createTheme({
  deDE,
  palette: {
    background: {
      default: grey[200],
    },
    primary: {
      main: redAccent[500],
    },
  },
  typography: {
    fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 40,
    },
    h2: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 32,
    },
    h3: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 24,
    },
    h4: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 20,
    },
    h5: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 16,
    },
    h6: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 14,
    },
  },
});

export default theme;
