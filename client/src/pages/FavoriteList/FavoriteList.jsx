import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDispatch } from "react-redux";
import { Box, Button, Grid } from "@mui/material";
import { toast } from "react-toastify";

import Container from "../../components/Container/Container.jsx";
import favoriteApi from "../../api/modules/favorite.api.js";
import { setGlobalLoading } from "../../redux/features/globalLoadingSlice.js";
import { removeFavorite } from "../../redux/features/userSlice.js";
import MediaItem from "../../components/MediaItem/MediaItem.jsx";

// FAVORITE LIST
/* --- Favorite Item ---- */
const FavoriteItem = ({ media, onRemoved }) => {
  const dispatch = useDispatch();
  const [onRequest, setOnRequest] = useState(false);

  // Transform favorite object to media object format for MediaItem
  const transformedMedia = {
    id: media.mediaId,
    title: media.mediaTitle,
    name: media.mediaTitle,
    poster_path: media.mediaPoster,
    vote_average: media.mediaRate,
    mediaId: media.mediaId
  };

  const onRemove = async () => {
    if (onRequest) return;

    setOnRequest(true);
    try {
      const response = await favoriteApi.remove({
        favoriteId: media.id || media._id
      });
      
      toast.success("Remove favorite success");
      dispatch(removeFavorite({ mediaId: media.mediaId }));
      onRemoved(media.id || media._id);
    } catch (err) {
      toast.error(err?.message || "Failed to remove favorite");
    } finally {
      setOnRequest(false);
    }
  };

  return (
    <>
      <MediaItem media={transformedMedia} mediaType={media.mediaType} />
      <Button
        fullWidth
        variant="contained"
        sx={{ marginTop: 2 }}
        startIcon={<DeleteIcon />}
        disabled={onRequest}
        onClick={onRemove}
      >
        {onRequest ? "removing..." : "remove"}
      </Button>
    </>
  );
};

/* =======================
   Favorite List
======================= */
const FavoriteList = () => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const skip = 8;

  useEffect(() => {
    const getFavorites = async () => {
      dispatch(setGlobalLoading(true));

      try {
        const response = await favoriteApi.getList();
        console.log("Favorites response:", response);
        if (response.length > 0) {
          console.log("First favorite object keys:", Object.keys(response[0]));
          console.log("First favorite object:", response[0]);
        }
        
        setCount(response.length);
        setMedias([...response]);
        setFilteredMedias([...response].slice(0, skip));
      } catch (err) {
        console.error("Favorites error:", err);
        toast.error(err?.message || "Failed to load favorites");
      } finally {
        dispatch(setGlobalLoading(false));
      }
    };

    getFavorites();
  }, [dispatch]);

  const onLoadMore = () => {
    setFilteredMedias([
      ...filteredMedias,
      ...[...medias].splice(page * skip, skip)
    ]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    const newMedias = medias.filter(e => (e.id || e._id) !== id);
    setMedias(newMedias);
    setFilteredMedias([...newMedias].slice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <Box
      sx={{
        padding: { xs: "1rem", md: "2rem" },
        maxWidth: "1400px",
        margin: "0 auto"
      }}
    >
      <Container header={`Your favorites (${count})`}>
        <Grid container spacing={2}>
          {filteredMedias.map((media, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <FavoriteItem media={media} onRemoved={onRemoved} />
            </Grid>
          ))}
        </Grid>

        {filteredMedias.length < medias.length && (
          <Button sx={{ marginTop: 2 }} onClick={onLoadMore}>
            load more
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default FavoriteList;
/* can i die now */