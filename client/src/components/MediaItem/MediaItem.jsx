import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// MEDIA ITEM
import tmdbConfigs from "../../api/configs/tmdb.configs";
import { routesGen } from "../../routes/routes";
import favoriteUtils from "../../utils/favorite.utils";
import favoriteApi from "../../api/modules/favorite.api";
import { addFavorite, removeFavorite } from "../../redux/features/userSlice";

/* INLINE HELPERS */

// BACKGROUND IMAGE
const backgroundImage = (img) => ({
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

// TYPOGRAPHY ELLIPSIS
const typoLines = (lines = 1) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
});

// RATE CIRCLE
const RateCircle = ({ value }) => {
  const percent = Math.round(value * 10);

  return (
    <Box
      sx={{
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%",
        background: "#1a1a1a",
        border: "2px solid #C1121F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: "#C1121F",
      }}
    >
      <Typography fontWeight={700} fontSize="0.7rem" sx={{ letterSpacing: 0.3 }}>
        {percent}%
      </Typography>
    </Box>
  );
};

/* MEDIA ITEM COMPONENT */
const MediaItem = ({ media, mediaType }) => {
  const { listFavorites, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [rate, setRate] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Determine type safely
  const isMovie = mediaType === "movie";
  const isTV = mediaType === "tv";
  const isPerson = mediaType === "people";

  useEffect(() => {
    // Title
    setTitle(media.title || media.name || "");

    // Poster
    setPosterPath(
      tmdbConfigs.posterPath(
        media.poster_path || media.backdrop_path || media.profile_path
      )
    );

    // Release date
    if (isMovie) setReleaseDate(media.release_date?.split("-")[0] || "");
    else if (isTV) setReleaseDate(media.first_air_date?.split("-")[0] || "");
    else setReleaseDate("");

    // Rating
    setRate(media.vote_average || null);

    // Check favorite
    setIsFavorite(
      favoriteUtils.check({
        listFavorites,
        mediaId: media.id,
      })
    );
  }, [media, mediaType, listFavorites, isMovie, isTV]);

  /* FAVORITE HANDLER */
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to add favorites");
      return;
    }

    if (isFavorite) {
      const favorite = listFavorites.find(
        (e) => e.mediaId.toString() === media.id.toString()
      );
      if (favorite) {
        try {
          await favoriteApi.remove({ favoriteId: favorite.id });
          dispatch(removeFavorite({ mediaId: media.id }));
          toast.success("Removed from favorites");
        } catch (err) {
          toast.error(err.message || "Failed to remove favorite");
        }
      }
    } else {
      try {
        const response = await favoriteApi.add({
          mediaId: media.id,
          mediaType,
          mediaTitle: title,
          mediaPoster: posterPath,
          mediaRate: rate,
        });
        dispatch(addFavorite(response));
        toast.success("Added to favorites");
      } catch (err) {
        toast.error(err.message || "Failed to add favorite");
      }
    }
  };

  /* PLAY / NAVIGATE */
  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPerson) navigate(routesGen.person(media.id));
    else navigate(routesGen.mediaDetail(mediaType, media.id));
  };

  return (
    <Link
      to={isPerson ? routesGen.person(media.id) : routesGen.mediaDetail(mediaType, media.id)}
      style={{ textDecoration: "none" }}
    >
      <Box
        sx={{
          ...backgroundImage(posterPath),
          paddingTop: "160%",
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
          "&:hover": {
            boxShadow: "0 12px 24px rgba(193, 18, 31, 0.4)",
          },
          "&:hover .media-info": { opacity: 1, bottom: 0 },
          "&:hover .media-back-drop, &:hover .media-play-btn, &:hover .media-favorite-btn": {
            opacity: 1,
          },
        }}
      >
        {/* FAVORITE ICON */}
        {!isPerson && user && (
          <IconButton
            className="media-favorite-btn"
            onClick={handleToggleFavorite}
            sx={{
              display: { xs: "none", md: "flex" },
              opacity: 0,
              transition: "0.3s",
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              width: "2.5rem",
              height: "2.5rem",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ fontSize: "1.5rem", color: "#C1121F" }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: "1.5rem", color: "#fff" }} />
            )}
          </IconButton>
        )}

        {/* BACKDROP */}
        <Box
          className="media-back-drop"
          sx={{
            opacity: { xs: 1, md: 0 },
            transition: "0.3s",
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          }}
        />

        {/* PLAY BUTTON */}
        {!isPerson && (
          <Button
            className="media-play-btn"
            variant="contained"
            onClick={handlePlayClick}
            sx={{
              display: { xs: "none", md: "flex" },
              opacity: 0,
              transition: "0.3s",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <PlayArrowIcon />
          </Button>
        )}

        {/* INFO */}
        <Box
          className="media-info"
          sx={{
            transition: "0.3s",
            opacity: { xs: 1, md: 0 },
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: "20px",
            color: "white",
          }}
        >
          <Stack spacing={0.5}>
            {releaseDate && <Typography variant="caption">{releaseDate}</Typography>}
            {title && (
              <Typography fontWeight={700} sx={{ fontSize: "1.2rem", ...typoLines(1), marginTop: "3px" }}>
                {title}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* PEOPLE NAME */}
        {isPerson && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: "8px",
              background: "rgba(0,0,0,0.6)",
            }}
          >
            <Typography sx={{ ...typoLines(1), color: "white" }}>{media.name}</Typography>
          </Box>
        )}
      </Box>
    </Link>
  );
};

export default MediaItem;