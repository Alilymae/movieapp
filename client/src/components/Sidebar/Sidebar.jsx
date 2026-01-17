import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo/Logo.jsx";

// SIDEBAR
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";

// ICONS FML
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

import { themeModes } from "../../configs/theme.configs";
import { setThemeMode } from "../../redux/features/themeModeSlice";
import { setUser } from "../../redux/features/userSlice";

const Sidebar = ({ open, toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { themeMode } = useSelector((state) => state.themeMode);
  const location = useLocation();

  const onSwitchTheme = () => {
    const theme =
      themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };

  // REUSABLE ACTIVE STYLE CUS IM NOT REPEATING THIS AGAIN OML
  const activeStyle = {
    backgroundColor: "var(--primary-color)",
    color: "var(--contrast-text)",
    borderRadius: "2px",
  };

  const inactiveStyle = {
    borderRadius: "10px",
  };

  return (
    <Drawer
      open={open}
      onClose={() => toggleSidebar(false)}
      sx={{
        "& .MuiDrawer-Paper": {
          width: 250,
          boxSizing: "border-box",
          borderRight: "0px",
          paddingBottom: "20px",
        },
      }}
    >
      <Toolbar sx={{ paddingTop: "60px", paddingBottom: "20px", paddingX: 0, color: "text.primary" }}>
        <Stack width="100%" direction="row" justifyContent="center">
          <Logo />
        </Stack>
      </Toolbar>

      <List sx={{ paddingX: "22px" }}>
        <Typography variant="h6" marginBottom="10px">
          Menu
        </Typography>

        {/* HOME */}
        <ListItemButton
          component={Link}
          to="/"
          onClick={() => toggleSidebar(false)}
          sx={location.pathname === "/" ? activeStyle : inactiveStyle}
        >
          <ListItemIcon>
            <HomeOutlinedIcon
              style={{
                color:
                  location.pathname === "/"
                    ? "var(--contrast-text)"
                    : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        {/* MOVIES */}
        <ListItemButton
          component={Link}
          to="/movies"
          onClick={() => toggleSidebar(false)}
          sx={location.pathname === "/movies" ? activeStyle : inactiveStyle}
        >
          <ListItemIcon>
            <MovieCreationOutlinedIcon
              style={{
                color:
                  location.pathname === "/movies"
                    ? "var(--contrast-text)"
                    : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Movies" />
        </ListItemButton>

        {/*SERIES */}
        <ListItemButton
          component={Link}
          to="/tv"
          onClick={() => toggleSidebar(false)}
          sx={location.pathname === "/tv" ? activeStyle : inactiveStyle}
        >
          <ListItemIcon>
            <TvOutlinedIcon
              style={{
                color:
                  location.pathname === "/tv"
                    ? "var(--contrast-text)"
                    : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Series" />
        </ListItemButton>

        {/* SEARCH */}
        <ListItemButton
          component={Link}
          to="/search"
          onClick={() => toggleSidebar(false)}
          sx={location.pathname === "/search" ? activeStyle : inactiveStyle}
        >
          <ListItemIcon>
            <SearchOutlinedIcon
              style={{
                color:
                  location.pathname === "/search"
                    ? "var(--contrast-text)"
                    : "inherit",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </ListItemButton>

        {user && (
          <>
            <Typography variant="h6" marginY="10px">
              Personal
            </Typography>

            {/* PROFILE */}
            <ListItemButton
              component={Link}
              to="/profile"
              onClick={() => toggleSidebar(false)}
              sx={location.pathname === "/profile" ? activeStyle : inactiveStyle}
            >
              <ListItemIcon>
                <PersonOutlineIcon
                  style={{
                    color:
                      location.pathname === "/profile"
                        ? "var(--contrast-text)"
                        : "inherit",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>

            {/* FAVORITES */}
            <ListItemButton
              component={Link}
              to="/favorites"
              onClick={() => toggleSidebar(false)}
              sx={location.pathname === "/favorites" ? activeStyle : inactiveStyle}
            >
              <ListItemIcon>
                <FavoriteBorderOutlinedIcon
                  style={{
                    color:
                      location.pathname === "/favorites"
                        ? "var(--contrast-text)"
                        : "inherit",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItemButton>

            {/* REVIEWS */}
            <ListItemButton
              component={Link}
              to="/reviews"
              onClick={() => toggleSidebar(false)}
              sx={location.pathname === "/reviews" ? activeStyle : inactiveStyle}
            >
              <ListItemIcon>
                <RateReviewOutlinedIcon
                  style={{
                    color:
                      location.pathname === "/reviews"
                        ? "var(--contrast-text)"
                        : "inherit",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Reviews" />
            </ListItemButton>

            {/* PASSWORD UPDATE */}
            <ListItemButton
              component={Link}
              to="/password-update"
              onClick={() => toggleSidebar(false)}
              sx={
                location.pathname === "/password-update"
                  ? activeStyle
                  : inactiveStyle
              }
            >
              <ListItemIcon>
                <LockResetOutlinedIcon
                  style={{
                    color:
                      location.pathname === "/password-update"
                        ? "var(--contrast-text)"
                        : "inherit",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Password Update" />
            </ListItemButton>

            {/* ADMIN PANEL */}
            <ListItemButton
              component="a"
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => toggleSidebar(false)}
              sx={inactiveStyle}
            >
              <ListItemIcon>
                <AdminPanelSettingsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItemButton>
          </>
        )}

        {/* THEME */}
        <Typography variant="h6" marginY="10px">
          Theme
        </Typography>

        <ListItemButton onClick={onSwitchTheme}>
          <ListItemIcon>
            {themeMode === themeModes.dark ? (
              <DarkModeOutlinedIcon />
            ) : (
              <WbSunnyOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={themeMode === "dark" ? "Dark Mode" : "Light Mode"} />
        </ListItemButton>

        {/* SIGN OUT */}
        {user && (
          <ListItemButton onClick={() => dispatch(setUser(null))}>
            <ListItemIcon>
              <LogoutOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
