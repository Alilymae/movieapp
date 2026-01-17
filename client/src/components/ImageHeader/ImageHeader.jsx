import React from "react";
import { Box, useTheme } from "@mui/material";

// IMAGE HEADER
const ImageHeader = ({ imgPath }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        zIndex: -1,
        position: "relative",
        paddingTop: { xs: "60%", sm: "40%", md: "35%" },
        backgroundPosition: "top",
        backgroundSize: "cover",
        backgroundImage: `url(${imgPath})`,
        backgroundAttachment: "fixed",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))"
              : "linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0.3))"
        }
      }}
    />
  );
};

export default ImageHeader;