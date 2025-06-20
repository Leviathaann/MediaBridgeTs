import { Container, Box, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppNavbar } from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MoviesPage } from "./pages/moviesPage";
// import { showsPage } from "./pages/showsPage";

export const baseURL = "http://localhost:3000";

const darkTheme = createTheme({
  palette: {
    mode: "dark", // This is the key setting for dark mode
    primary: {
      main: "#90caf9", // A common light blue for dark mode primary (MUI default)
    },
    secondary: {
      main: "#f48fb1", // A common pink for dark mode secondary (MUI default)
    },
    background: {
      default: "#121212", // Very dark grey for general background
      paper: "#1e1e1e", // Slightly lighter dark grey for card/paper backgrounds
    },
    text: {
      primary: "#ffffff", // White text for primary
      secondary: "#aaaaaa", // Light grey text for secondary
    },
  },
  typography: {},
  components: {
    MuiCard: {
      styleOverrides: {
        root: {},
      },
    },
    MuiCardMedia: {
      styleOverrides: {},
    },
  },
});

// App.tsx

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppNavbar />

        {/* HERO SECTION - This is self-contained */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              My Emby Media
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Browse your favorite movies and TV shows.
            </Typography>
          </Container>
        </Box>

        {/* MAIN CONTENT AREA - This is separate from the hero section */}
        <main>
          <Routes>
            <Route path="/" element={<MoviesPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route
              path="*"
              element={
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h4">404 - Page Not Found</Typography>
                </Box>
              }
            />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}
export default App;
