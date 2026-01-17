import express from "express";
import mediaController from "../controllers/media.controller.js";

// MEDIA ROUTER
const router = express.Router({ mergeParams: true });

// GET GENRES
router.get("/genres", mediaController.getGenres);

// SEARCH MEDIA
router.get("/search", mediaController.search);

// GET DETAIL
router.get("/detail/:mediaId", mediaController.getDetail);

// GET LIST
router.get("/:mediaCategory", mediaController.getList);
// GET /api/v1/movie/top_rated
router.get("/:mediaCategory", mediaController.getList);

export default router;
