import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setThemeMode } from "../../redux/features/themeModeSlice";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { IconButton, Stack } from "@mui/material";
import { Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material";
import Sidebar from "../Sidebar/Sidebar.jsx";
import UserMenu from "../UserMenu/UserMenu.jsx";
import themeConfigs, { themeModes } from "../../configs/theme.configs";
import "./Navbar.css";

// NAVBAR
const Navbar = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.themeMode.themeMode);
  const { user } = useSelector((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleToggleTheme = () => {
    const newMode =
      themeMode === themeModes.light ? themeModes.dark : themeModes.light;
    dispatch(setThemeMode(newMode));
  };

  // Apply theme CSS variables
  useEffect(() => {
    const palette =
      themeMode === themeModes.dark
        ? themeConfigs.palettes.dark
        : themeConfigs.palettes.light;

    const root = document.documentElement;
    root.style.setProperty("--primary-color", palette.primary.main);
    root.style.setProperty("--secondary-color", palette.secondary.main);
    root.style.setProperty("--background-color", palette.background.default);
    root.style.setProperty("--paper-color", palette.background.paper);
    root.style.setProperty("--text-color", palette.text.primary);
    root.style.setProperty("--contrast-text", palette.primary.contrastText);
  }, [themeMode]);

  // Watch screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Watch scroll to darken navbar after 50px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    // Set initial state in case page is already scrolled
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sidebar only for mobile */}
      {isMobile && (
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <nav className={`navbar ${themeMode} ${scrolled ? "scrolled" : ""}`}>
        {/* Left: Logo + menu icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              className="mobile-menu-icon"
              onClick={toggleSidebar}
            >
              <MenuIcon />
            </IconButton>
          )}
          <h1>IMAGIX</h1>
        </div>

        {/* Desktop navigation */}
        {!isMobile && (
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/movies">Movies</Link>
            </li>
            <li>
              <Link to="/tv">Series</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
          </ul>
        )}

        {/* Right side — now works on mobile + desktop */}
        <ul className="right-section">

          {/* Sign In should always appear when user is not logged in */}
          {!user && (
            <li>
              <button
                className={`auth-btn ${isMobile ? "mobile-signin" : ""}`}
                onClick={() => dispatch(setAuthModalOpen(true))}
              >
                Sign In
              </button>

            </li>
          )}

          {/* UserMenu works everywhere */}
          {user && <UserMenu />}

          {/* Theme toggle — desktop only */}
          {!isMobile && (
            <li className="dtl">
              <IconButton color="inherit" onClick={handleToggleTheme}>
                {themeMode === themeModes.light ? (
                  <Brightness4 />
                ) : (
                  <Brightness7 />
                )}
              </IconButton>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
