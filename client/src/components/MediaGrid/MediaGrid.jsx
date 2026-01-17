import React from "react";
import { Grid } from "@mui/material";
import MediaItem from "../MediaItem/MediaItem.jsx";

// MEDIA GRID
const MediaGrid = ({ medias, mediaType }) => {
  return (
    <Grid container spacing={2}>
      {medias.map((media, index) => (
        <Grid
          key={index}
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        >
          <MediaItem media={media} mediaType={mediaType} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MediaGrid;
