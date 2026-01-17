import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";


import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";

import tmdbConfigs from "../../api/configs/tmdb.configs";
import mediaApi from "../../api/modules/media.api";
import favoriteApi from "../../api/modules/favorite.api";

import { setGlobalLoading } from "../../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { addFavorite, removeFavorite } from "../../redux/features/userSlice";

// MEDIA DETAIL
import ImageHeader from "../../components/ImageHeader/ImageHeader.jsx";
import Container from "../../components/Container/Container.jsx";
import Rating from "../../components/Rating/Rating.jsx";
import CastSlider from "../../components/CastSlider/CastSlider.jsx";
import MediaVideosSlide from "../../components/MediaVideosSlide/MediaVideosSlide.jsx";
import BackdropSlide from "../../components/BackdropSlide/BackdropSlide.jsx";
import PosterSlide from "../../components/PosterSlide/PosterSlide.jsx";
import RecommendSlide from "../../components/RecommendSlide/RecommendSlide.jsx";
import MediaSlider from "../../components/MediaSlider/MediaSlider.jsx";
import MediaReview from "../../components/MediaReview/MediaReview.jsx";
import { routesGen } from "../../routes/routes";

const MediaDetail = () => {
  const { mediaType, mediaId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const { user, listFavorites } = useSelector((state) => state.user);

  const [media, setMedia] = useState(null);
  const [genres, setGenres] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMedia = async () => {
      dispatch(setGlobalLoading(true));

      try {
        const response = await mediaApi.getDetail({
          mediaType,
          mediaId
        });

        setMedia(response);
        setGenres(response.genres?.slice(0, 2) || []);
        setIsFavorite(response.isFavorite);
      } catch (err) {
        toast.error(err.message || "Failed to load media");
      } finally {
        dispatch(setGlobalLoading(false));
      }
    };

    fetchMedia();
  }, [mediaType, mediaId, dispatch]);

  /* ===================== FAVORITES ===================== */

  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));
    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.id,
      mediaTitle: media.title || media.name,
      mediaType:
        mediaType === tmdbConfigs.mediaType.movie ? "movie" : "tv",
      mediaPoster:
        media.poster_path || media.backdrop_path || "",
      mediaRate: media.vote_average
    };

    setOnRequest(true);

    try {
      const response = await favoriteApi.add(body);

      dispatch(addFavorite(response));
      setIsFavorite(true);
      toast.success("Added to favorites");
    } catch (err) {
      toast.error(err.message || "Failed to add favorite");
    } finally {
      setOnRequest(false);
    }
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;

    const favorite = listFavorites.find(
      (e) => e.mediaId.toString() === media.id.toString()
    );

    if (!favorite) return;

    setOnRequest(true);

    try {
      await favoriteApi.remove({
        favoriteId: favorite.id
      });

      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(err.message || "Failed to remove favorite");
    } finally {
      setOnRequest(false);
    }
  };

  if (!media) return null;

  return (
    <>
      {/* HEADER IMAGE */}
      <ImageHeader
        imgPath={tmdbConfigs.backdropPath(
          media.backdrop_path || media.poster_path
        )}
      />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          marginTop: { xs: "-8rem", md: "-14rem" },
          paddingX: { xs: "1rem", md: "3rem" },
          color: "white"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }
          }}
        >
          {/* POSTER */}
          <Box
            sx={{
              width: { xs: "70%", sm: "50%", md: "35%" },
              margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" }
            }}
          >
            <Box
              sx={{
                paddingTop: "140%",
                borderRadius: "12px",
                backgroundImage: `url(${tmdbConfigs.posterPath(
                  media.poster_path || media.backdrop_path
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          </Box>

          {/* INFO */}
          <Box sx={{ flex: 1, color: "text.primary" }}>
            <Stack spacing={3}>
              <Typography fontSize={{ xs: "2rem", md: "3rem" }} fontWeight="700">
                {media.title || media.name} (
                {mediaType === tmdbConfigs.mediaType.movie
                  ? media.release_date?.split("-")[0]
                  : media.first_air_date?.split("-")[0]}
                )
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Rating value={media.vote_average} />
                <Divider orientation="vertical" flexItem />
                {genres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} color="primary" />
                ))}
              </Stack>

              <Typography variant="body1">{media.overview}</Typography>

              {/* BUTTONS */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  disabled={onRequest}
                  onClick={onFavoriteClick}
                  sx={{
                    minWidth: 0,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: isFavorite ? "#fff" : "#000",
                    color: isFavorite ? "#c1121f" : "#fff",
                    "&:hover": {
                      backgroundColor: "#1a1a1a"
                    }
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderOutlinedIcon />
                  )}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={() =>
                    videoRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Watch now
                </Button>

                {mediaType === tmdbConfigs.mediaType.movie && (
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(135deg, #c1121f 0%, #e5383b 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #a00d1a 0%, #c1121f 100%)"
                      }
                    }}
                    onClick={() => {
                      if (!user) return dispatch(setAuthModalOpen(true));
                      navigate(routesGen.scheduleSelection(mediaType, mediaId));
                    }}
                  >
                    Book Tickets
                  </Button>
                )}
              </Stack>

              {/* CAST */}
              <Container header="Cast">
                <CastSlider casts={media.credits.cast} />
              </Container>
            </Stack>
          </Box>
        </Box>

        {/* VIDEOS */}
        <Box ref={videoRef} sx={{ marginTop: "3rem" }}>
          <Container header="Videos">
            <MediaVideosSlide
              videos={media.videos.results.slice(0, 5)}
            />
          </Container>
        </Box>

        {/* BACKDROPS */}
        {media.images.backdrops.length > 0 && (
          <Container header="Backdrops">
            <BackdropSlide backdrops={media.images.backdrops} />
          </Container>
        )}

        {/* POSTERS */}
        {media.images.posters.length > 0 && (
          <Container header="Posters">
            <PosterSlide posters={media.images.posters} />
          </Container>
        )}

        {/* REVIEWS */}
        <MediaReview
          reviews={media.reviews}
          media={media}
          mediaType={mediaType}
        />

        {/* RECOMMENDATIONS */}
        <Container header="You may also like">
          {media.recommend.length > 0 ? (
            <RecommendSlide medias={media.recommend} mediaType={mediaType} />
          ) : (
            <MediaSlider
              mediaType={mediaType}
              mediaCategory={tmdbConfigs.mediaCategory.top_rated}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default MediaDetail;
