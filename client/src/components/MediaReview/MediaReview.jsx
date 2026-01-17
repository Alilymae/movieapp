
import {
    Box,
    Button,
    Divider,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

// MEDIA REVIEW
import Container from "../Container/Container.jsx";
import reviewApi from "../../api/modules/review.api";
import TextAvatar from "../TextAvatar/TextAvatar.jsx";

/* REVIEW ITEM */
const ReviewItem = ({ review, onRemoved }) => {
    const { user } = useSelector((state) => state.user);
    const [onRequest, setOnRequest] = useState(false);

    const onRemove = async () => {
        if (onRequest) return;
        setOnRequest(true);

        try {
            await reviewApi.remove({
                reviewId: review.id
            });
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
                padding: 2,
                borderRadius: "5px",
                position: "relative",
                opacity: onRequest ? 0.6 : 1,
                "&:hover": { backgroundColor: "background.paper" }
            }}
        >
            <Stack direction="row" spacing={2}>
                <TextAvatar text={review.user?.displayName} />

                <Stack spacing={2} flexGrow={1}>
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight="700">
                            {review.user?.displayName}
                        </Typography>
                        <Typography variant="caption">
                            {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                        </Typography>
                    </Stack>

                    <Typography variant="body1" textAlign="justify">
                        {review.content}
                    </Typography>

                    {user && user.id === review.user.id && (
                        <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            disabled={onRequest}
                            onClick={onRemove}
                            sx={{
                                position: { xs: "relative", md: "absolute" },
                                right: { xs: 0, md: "10px" },
                                marginTop: { xs: 2, md: 0 },
                                width: "max-content"
                            }}
                        >
                            {onRequest ? "removing..." : "remove"}
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};

/* MAIN COMPONENT */
const MediaReview = ({ reviews = [], media, mediaType }) => {
    const { user } = useSelector((state) => state.user);

    const [listReviews, setListReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [onRequest, setOnRequest] = useState(false);
    const [content, setContent] = useState("");
    const [reviewCount, setReviewCount] = useState(0);

    const skip = 4;

    useEffect(() => {
        setListReviews([...reviews]);
        setFilteredReviews([...reviews].slice(0, skip));
        setReviewCount(reviews.length);
        setPage(1);
    }, [reviews]);

    const onAddReview = async () => {
        if (!content.trim()) {
            toast.error("Review cannot be empty");
            return;
        }

        if (onRequest) return;
        setOnRequest(true);

        const body = {
            content,
            mediaId: media.id,
            mediaType,
            mediaTitle: media.title || media.name,
            mediaPoster: media.poster_path
        };

        try {
            const response = await reviewApi.add(body);
            toast.success("Review posted successfuly");
            setFilteredReviews([...filteredReviews, response]);
            setReviewCount((prev) => prev + 1);
            setContent("");
        } catch (err) {
            toast.error(err.message || "Failed to post review");
        } finally {
            setOnRequest(false);
        }
    };

    const onLoadMore = () => {
        const next = [...listReviews].slice(page * skip, page * skip + skip);
        setFilteredReviews([...filteredReviews, ...next]);
        setPage((prev) => prev + 1);
    };

    const onRemoved = (id) => {
        const newList = listReviews.filter((e) => e.id !== id);
        setListReviews(newList);
        setFilteredReviews(newList.slice(0, page * skip));
        setReviewCount((prev) => prev - 1);
        toast.success("Review removed");
    };

    return (
        <Container header={`Reviews (${reviewCount})`}>
            <Stack spacing={4} marginBottom={2}>
                {filteredReviews.map(
                    (item) =>
                        item.user && (
                            <Box key={item.id}>
                                <ReviewItem review={item} onRemoved={onRemoved} />
                                <Divider sx={{ display: { xs: "block", md: "none" } }} />
                            </Box>
                        )
                )}

                {filteredReviews.length < listReviews.length && (
                    <Button onClick={onLoadMore}>load more</Button>
                )}
            </Stack>

            {user && (
                <>
                    <Divider />
                    <Stack direction="row" spacing={2} marginTop={2}>
                        <TextAvatar text={user.displayName} />
                        <Stack spacing={2} flexGrow={1}>
                            <Typography variant="h6" fontWeight="700">
                                {user.displayName}
                            </Typography>

                            <TextField
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                multiline
                                rows={4}
                                placeholder="Write your review"
                            />

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SendOutlinedIcon />}
                                disabled={onRequest}
                                onClick={onAddReview}
                                sx={{ width: "max-content" }}
                            >
                                {onRequest ? "posting..." : "post"}
                            </Button>
                        </Stack>
                    </Stack>
                </>
            )}
        </Container>
    );
};

export default MediaReview;
