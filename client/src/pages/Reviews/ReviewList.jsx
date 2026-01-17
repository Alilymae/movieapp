
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import reviewApi from "../../api/modules/review.api";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import Container from "../../components/Container/Container.jsx";
import { setGlobalLoading } from "../../redux/features/globalLoadingSlice.js";
import { routesGen } from "../../routes/routes.jsx";

// REVIEW LIST

/* REVIEW ITEM */

const ReviewItem = ({ review, onRemoved }) => {
  const theme = useTheme();
  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;

    setOnRequest(true);
    try {
      await reviewApi.remove({
        reviewId: review.id
      });
      toast.success("Remove review success");
      onRemoved(review.id);
    } catch (err) {
      toast.error(err.message || "Failed to remove review");
    } finally {
      setOnRequest(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        padding: 1,
        opacity: onRequest ? 0.6 : 1,
        borderRadius: 2,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.mode === "dark"
            ? "rgba(193, 18, 30, 0.31)"
            : "rgba(193, 18, 30, 0.22)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-2px)"
        }
      }}
    >
      {/* Poster */}
      <Box sx={{ width: { xs: 0, md: "10%" } }}>
        <Link
          to={routesGen.mediaDetail(review.mediaType, review.mediaid)}
          style={{ textDecoration: "none" }}
        >
          <Box
            sx={{
              paddingTop: "160%",
              backgroundImage: `url(${tmdbConfigs.posterPath(
                review.mediaPoster
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 1
            }}
          />
        </Link>
      </Box>

      {/* Content */}
      <Box
        sx={{
          width: { xs: "100%", md: "80%" },
          padding: { xs: 0, md: "0 2rem" }
        }}
      >
        <Stack spacing={1}>
          <Link
            to={routesGen.mediaDetail(review.mediaType, review.mediaid)}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="h6" noWrap>
              {review.mediaTitle}
            </Typography>
          </Link>

          <Typography variant="caption" color="text.secondary">
            {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Typography>

          <Typography>{review.content}</Typography>
        </Stack>
      </Box>

      {/* Remove Button */}
      <Button
        variant="contained"
        color="error"
        sx={{
          position: { xs: "relative", md: "absolute" },
          right: { xs: 0, md: "10px" },
          top: { md: "10px" },
          marginTop: { xs: 2, md: 0 },
          width: "max-content"
        }}
        startIcon={<DeleteIcon />}
        disabled={onRequest}
        onClick={onRemove}
      >
        {onRequest ? "removing..." : "remove"}
      </Button>
    </Box>
  );
};

/* REVIEW LIST */

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const skip = 2;

  useEffect(() => {
    const getReviews = async () => {
      dispatch(setGlobalLoading(true));
      try {
        const response = await reviewApi.getList();
        setReviews(response);
        setFilteredReviews(response.slice(0, skip));
        setCount(response.length);
      } catch (err) {
        toast.error(err.message || "Failed to load reviews");
      } finally {
        dispatch(setGlobalLoading(false));
      }
    };

    getReviews();
  }, [dispatch]);

  const onLoadMore = () => {
    setFilteredReviews([
      ...filteredReviews,
      ...reviews.slice(page * skip, page * skip + skip)
    ]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    const newReviews = reviews.filter(r => r.id !== id);
    setReviews(newReviews);
    setFilteredReviews(newReviews.slice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Container header={`Your reviews (${count})`}>
        <Stack spacing={2}>
          {filteredReviews.map(item => (
            <Box key={item.id}>
              <ReviewItem review={item} onRemoved={onRemoved} />
              <Divider sx={{ display: { xs: "block", md: "none" } }} />
            </Box>
          ))}

          {filteredReviews.length < reviews.length && (
            <Button onClick={onLoadMore}>load more</Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ReviewList;