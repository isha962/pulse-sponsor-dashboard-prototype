import { CssBaseline, Container } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRoutes } from "./routes";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0b0b12", // page background
      paper: "#121224"    // card backgrounds
    },
    primary: {
      main: "#ff4fd8"     // pink accent
    },
    secondary: {
      main: "#4da3ff"     // blue (we’ll use for chart)
    },
    text: {
      primary: "#ffd6f3",  // soft pink-ish text
      secondary: "#b9b4c7"
    },
    divider: "rgba(255,79,216,0.18)"
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: `Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
    h4: { fontWeight: 900 },
    h6: { fontWeight: 800 }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,79,216,0.22)",
          backgroundImage: "linear-gradient(180deg, rgba(255,79,216,0.06), rgba(77,163,255,0.03))"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 700 }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: "#ffd6f3",
          fontWeight: 800
        }
      }
    }
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <AppRoutes />
      </Container>
    </ThemeProvider>
  );
}

