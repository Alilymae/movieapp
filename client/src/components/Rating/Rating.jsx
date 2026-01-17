import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

// RATING
const Rating = ({ value }) => {
  const theme = useTheme();
  const displayValue =
    typeof value === "number" && !Number.isNaN(value) ? value.toFixed(1) : "0.0";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.5rem 1rem",
        gap: 0.75,
        borderRadius: "1rem",
        backgroundColor: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.37)" : "rgba(255, 255, 255, 0.98)",
        color: theme.palette.text.primary,
      }}
    >
      <StarIcon
        sx={{
          color: "#f5c518",
          fontSize: 20,
          filter: "drop-shadow(0 0 5px rgba(255, 200, 0, 0.8))",
        }}
      />
      <Typography
        fontWeight={600}
        fontSize="0.85rem"
        sx={{ letterSpacing: 0.3 }}
      >
        {displayValue}
      </Typography>
    </Box>
  );
};

export default Rating;
//STARS