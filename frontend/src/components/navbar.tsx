import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom"; // Import Link

export function AppNavbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        ></IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Emby Bridge
        </Typography>

        {/* Use Link components for navigation */}
        <Button color="inherit" component={Link} to="/movies">
          Movies
        </Button>
        <Button color="inherit" component={Link} to="/tvshows">
          TV Shows
        </Button>
        <Button color="inherit" component={Link} to="/settings">
          {" "}
          {/* Future settings page */}
          Settings
        </Button>
      </Toolbar>
    </AppBar>
  );
}
