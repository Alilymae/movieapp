import React, { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { toast } from "react-toastify";
import tmdbConfigs from "../../api/configs/tmdb.configs.js"; 
import MediaItem from "../MediaItem/MediaItem.jsx";           
import personApi from "../../api/modules/person.api.js"; 

// PERSON MEDIA GRID
const PersonMediaGrid = ({ personId }) => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [page, setPage] = useState(1);
  const skip = 8; 

  // Fetch person media
  useEffect(() => {
    const getMedias = async () => {
      const { response, err } = await personApi.medias({ personId });

      console.log("PersonMediaGrid response:", response);
      console.log("PersonMediaGrid error:", err);

      if (err) {
        toast.error(err.message || "Failed to fetch medias");
        return;
      }

      if (response) {
        const castArray = response.cast || [];
        console.log("Cast array:", castArray);
        
        const mediasSorted = castArray.sort(
          (a, b) => getReleaseDate(b) - getReleaseDate(a)
        );
        setMedias(mediasSorted);
        setFilteredMedias(mediasSorted.slice(0, skip));
        setPage(1);
      }
    };

    getMedias();
  }, [personId]);

  // Helper: get release timestamp
  const getReleaseDate = (media) => {
    const date =
      media.media_type === tmdbConfigs.mediaType.movie
        ? new Date(media.release_date)
        : new Date(media.first_air_date);
    return date.getTime() || 0;
  };

  // Load more items
  const onLoadMore = () => {
    const nextItems = medias.slice(page * skip, (page + 1) * skip);
    setFilteredMedias(prev => [...prev, ...nextItems]);
    setPage(prev => prev + 1);
  };

  return (
    <div style={{ padding: "16px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Grid */}
      <Grid container spacing={1} style={{ marginRight: "-8px" }}>
        {filteredMedias.map((media, index) => (
          <Grid key={index} size={{ xs: 6, sm: 4, md: 3 }}>
            <MediaItem media={media} mediaType={media.media_type} />
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      {filteredMedias.length < medias.length && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Button variant="contained" onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonMediaGrid;
