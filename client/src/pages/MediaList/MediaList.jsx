import { Box, Button, Stack, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import mediaApi from "../../api/modules/media.api";
import MainSlider from "../../components/MainSlider/MainSlider";
import MediaGrid from "../../components/MediaGrid/MediaGrid";

// MEDIA LIST
const MediaList = () => {
  const { mediaType } = useParams();

  const [medias, setMedias] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [currCategory, setCurrCategory] = useState(0);
  const [currPage, setCurrPage] = useState(1);

  const mediaCategories = useMemo(() => ["popular", "top_rated"], []);
  const categoryLabels = ["Popular", "Top Rated"];

  // Normalize mediaType for API
  const normalizedMediaType =
    mediaType === "movies" ? "movie" :
    mediaType === "series" ? "tv" :
    mediaType;

  // Reset when mediaType changes
  useEffect(() => {
    setCurrCategory(0);
    setCurrPage(1);
    setMedias([]);
    window.scrollTo(0, 0);
  }, [mediaType]);

  // Fetch media data
  useEffect(() => {
    const fetchMedias = async () => {
      setMediaLoading(true);

      try {
        const response = await mediaApi.getList({
          mediaType: normalizedMediaType,
          mediaCategory: mediaCategories[currCategory],
          page: currPage
        });

        console.log("MediaList API Response:", response);

        const results = response?.results || [];
        console.log("Results extracted:", results);
        
        if (currPage === 1) setMedias(results);
        else setMedias(prev => [...prev, ...results]);
      } catch (err) {
        console.error("MediaList Error:", err);
        toast.error(err.message || "Failed to load media");
      } finally {
        setMediaLoading(false);
      }
    };

    fetchMedias();
  }, [normalizedMediaType, currCategory, currPage, mediaCategories]);

  const onCategoryChange = (index) => {
    if (index === currCategory) return;
    setCurrCategory(index);
    setCurrPage(1);
    setMedias([]);
  };

  const onLoadMore = () => setCurrPage(prev => prev + 1);

  return (
    <>
      {/* Hero / Slider */}
      <MainSlider
        mediaType={normalizedMediaType}
        mediaCategory={mediaCategories[currCategory]}
      />

      <Box sx={{ padding: "0 16px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Category Header */}
        <Stack
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          sx={{ mb: 4, mt: 2 }}
        >
          <Typography fontWeight={700} variant="h5">
            {normalizedMediaType === "movie" ? "Movies" : "TV Series"}
          </Typography>

          <Stack direction="row" spacing={2}>
            {categoryLabels.map((label, index) => (
              <Button
                key={index}
                variant={currCategory === index ? "contained" : "text"}
                onClick={() => onCategoryChange(index)}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Stack>

        {/* Media Grid */}
        <MediaGrid
          medias={medias}
          mediaType={normalizedMediaType}
        />

        {/* Load More */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button
            variant="contained"
            onClick={onLoadMore}
            disabled={mediaLoading}
          >
            {mediaLoading ? <CircularProgress size={24} /> : "Load More"}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default MediaList;
