import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack, TextField, CircularProgress, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import mediaApi from "../../api/modules/media.api";
import MediaGrid from "../../components/MediaGrid/MediaGrid.jsx";   

const mediaTypes = ["movie", "tv", "people"];
let timer;
const timeout = 500;

// MEDIA SEARCH
const MediaSearch = () => {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);

  // SEARCH FUNCTION
  const search = useCallback(async () => {
    if (!query.trim()) return;

    setOnSearch(true);

    try {
      const response = await mediaApi.search({
        mediaType,
        query,
        page
      });

      const results = response?.results || [];
      if (page === 1) setMedias(results);
      else setMedias(prev => [...prev, ...results]);
    } catch (err) {
      console.error("Search Error:", err);
      toast.error(err.message || "Failed to search media");
    } finally {
      setOnSearch(false);
    }
  }, [mediaType, query, page]);

  // EFFECT TO TRIGGER SEARCH
  useEffect(() => {
    if (!query.trim()) {
      setMedias([]);
      setPage(1);
    } else {
      search();
    }
  }, [search, query, mediaType, page]);

  // RESET MEDIAS ON MEDIA TYPE CHANGE
  useEffect(() => {
    setMedias([]);
    setPage(1);
  }, [mediaType]);

  const onCategoryChange = (type) => setMediaType(type);

  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => setQuery(newQuery), timeout);
  };

  return (
    <>
      <Toolbar />
      <Box style={{ padding: "16px", maxWidth: 1200, margin: "3rem auto" }}>
        <Stack spacing={2}>
          {/* Search Input */}
          <TextField
            placeholder="Search Imagix Cinemas"
            style={{ width: "100%" }}
            autoFocus
            onChange={onQueryChange}
          />

          {/* Category Buttons */}
          <Stack direction="row" spacing={2} justifyContent="right">
            {mediaTypes.map((type, index) => (
              <Button
                key={index}
                size="large"
                variant={mediaType === type ? "contained" : "outlined"}
                sx={{
                  textTransform: "capitalize",
                  color: mediaType === type 
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  borderColor: theme.palette.text.primary,
                  backgroundColor: mediaType === type
                    ? theme.palette.primary.main
                    : "transparent",
                  "&:hover": {
                    backgroundColor: mediaType === type
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover
                  }
                }}
                onClick={() => onCategoryChange(type)}
              >
                {type}
              </Button>
            ))}
          </Stack>

          {/* Media Grid */}
          <MediaGrid medias={medias} mediaType={mediaType} />

          {/* Load More Button */}
          {medias.length > 0 && (
            <Box style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <Button
                variant="contained"
                onClick={() => setPage(prev => prev + 1)}
                disabled={onSearch}
              >
                {onSearch ? <CircularProgress size={24} /> : "Load More"}
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MediaSearch;
