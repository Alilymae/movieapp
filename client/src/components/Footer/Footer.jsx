import { Paper, Stack, Button, Box, Typography, IconButton } from "@mui/material";
import React from "react";
import Container from "../Container/Container.jsx";
import Logo from "../Logo/Logo.jsx";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

// FOOTER
const Footer = () => {
  // EXTRAS
  const footerMenu = [
    { display: "Home", path: "/" },
    { display: "Movies", path: "/movies" },
    { display: "Series", path: "/tv" },
    { display: "Search", path: "/search" }
  ];

  return (
    <Box sx={{ backgroundColor: "#0a0a0a", paddingY: "3rem", paddingX: "3rem", marginTop: "5rem" }}>
      <Container>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={3}
        >
          {/* LEFT — LOGO */}
          <Logo />

          {/* CENTER — MENU */}
          <Stack direction="row" spacing={3}>
            {footerMenu.map((item, index) => (
              <Button
                key={index}
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  position: "relative",
                  "&:hover": {
                    backgroundColor: "transparent"
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "0%",
                    height: "2px",
                    bottom: "-4px",
                    left: 0,
                    backgroundColor: "#C1121F",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
                component={Link}
                to={item.path}
              >
                {item.display}
              </Button>

            ))}
          </Stack>

          {/* RIGHT — SOCIAL ICONS */}
          <Stack direction="row" spacing={1}>
            <IconButton sx={{
              color: "#fff", "&:hover": {
                backgroundColor: "#C1121F"
              }
            }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{
              color: "#fff", "&:hover": {
                backgroundColor: "#C1121F"
              }
            }}>
              <Twitter />
            </IconButton>
            <IconButton sx={{
              color: "#fff", "&:hover": {
                backgroundColor: "#C1121F"
              }
            }}>
              <Instagram />
            </IconButton>
          </Stack>
        </Stack>

        {/* CONTACT INFO */}
        <Stack alignItems="center" mt={4} spacing={0.5}>
          <Typography sx={{ color: "#fff", fontSize: "0.85rem" }}>
            info@imagixcinema.com
          </Typography>
          <Typography sx={{ color: "#fff", fontSize: "0.85rem" }}>
            +971 (058) 0173 00021
          </Typography>
        </Stack>

        {/* COPYRIGHT */}
        <Typography
          sx={{
            color: "#fff",
            fontSize: "0.75rem",
            textAlign: "center",
            marginTop: "2rem",
            opacity: 0.7,
          }}
        >
          © Imagix Cinema. All Rights Reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;