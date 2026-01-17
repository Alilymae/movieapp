import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Chip, Divider, Stack, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// SWIPER STYLES
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// SWIPER MODULES
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// MAIN SLIDER
import mediaApi from "../../api/modules/media.api";
import genreApi from "../../api/modules/genre.api";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import Rating from "../Rating/Rating.jsx";
import "./MainSlider.css";

// MAIN SLIDER
const MainSlider = ({ mediaType = "movie", mediaCategory = "popular" }) => {
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const theme = useTheme();

  // LOAD GENRES AND MEDIA
  useEffect(() => {
    const loadGenresAndMedia = async () => {
      try {
        // 1️⃣ Fetch genres
        const genreData = await genreApi.getList({ mediaType });
        setGenres(genreData?.genres || []); // safe fallback

        // 2️⃣ Fetch media items
        const mediaData = await mediaApi.getList({ mediaType, mediaCategory, page: 1 });
        setItems(mediaData?.results || []);
      } catch (error) {
        // Handle errors from either API
        console.error("MainSlider Load Error:", error);
        toast.error(error.message || "Failed to load data");
      }
    };

    loadGenresAndMedia();
  }, [mediaType, mediaCategory]);

  return (
    <Box sx={{ position: "relative", color: "#fff" }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        loop={items.length > 1} // only loop if more than 1 slide
        grabCursor
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        style={{ width: "100%", height: "max-content" }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            {/* BACKGROUND IMAGE */}
            <Box
              sx={{
                paddingTop: { xs: "145%", sm: "85%", md: "65%", lg: "50%" },
                backgroundImage: `url(${tmdbConfigs.backdropPath(item.backdrop_path || item.poster_path)})`,
                backgroundSize: "cover",
                backgroundPosition: "top"
              }}
            />
            {/* GRADIENT OVERLAY */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                background: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.3), transparent),
                             linear-gradient(to bottom, transparent 0%, transparent 60%, ${theme.palette.background.default} 100%)`
              }}
            />
            {/* CONTENT */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                paddingX: { sm: "10px", md: "4rem", lg: "8rem" }
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  width: { xs: "100%", sm: "80%", md: "50%", lg: "45%" },
                  paddingY: { xs: 2, md: 4 }
                }}
              >
                <Stack spacing={{ xs: 2, md: 3, lg: 4 }}>
                  {/* TITLE */}
                  <Typography
                    variant="h4"
                    fontSize={{ xs: "1.75rem", sm: "2rem", md: "2.5rem", lg: "3.5rem" }}
                    fontWeight={700}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      color: "#fff",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      lineHeight: 1.2
                    }}
                  >
                    {item.title || item.name}
                  </Typography>

                  {/* RATING & GENRES */}
                  <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" gap={1}>
                    <Rating value={item.vote_average} />
                    <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.3)" }} />
                    {[...item.genre_ids].slice(0, 2).map((id) => (
                      <Chip
                        key={id}
                        label={genres.find((g) => g.id === id)?.name || ""}
                        color="primary"
                        sx={{
                          fontWeight: 500,
                          padding: "0.5rem",
                          borderRadius: "1rem",
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText || "#fff"
                        }}
                      />
                    ))}
                  </Stack>

                  {/* OVERVIEW */}
                  <Typography
                    variant="body1"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      opacity: 0.95,
                      color: "#fff",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      lineHeight: 1.6
                    }}
                  >
                    {item.overview}
                  </Typography>

                  {/* WATCH NOW BUTTON */}
                  <Box sx={{ pt: { xs: 1, md: 2 } }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      component={Link}
                      to={`/media/${mediaType}/${item.id}`}
                      sx={{
                        px: { xs: 2, md: 3 },
                        py: { xs: 1, md: 1 },
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 1
                      }}
                    >
                      Watch Now
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default MainSlider;
// I ACTUALLY PUT TOO MUCH EFFORT IN THIS COMP HOLY. IM GONNA DIE