import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

// NORMALIZE MEDIA TYPE
const normalizeMediaType = (mediaType) => {
  if (["movie", "movies"].includes(mediaType)) return "movie";
  if (["tv", "series"].includes(mediaType)) return "tv";
  if (["person", "people"].includes(mediaType)) return "person";
  return mediaType;
};

// GET LIST
const getList = async (req, res) => {
  try {
    let { mediaType, mediaCategory } = req.params;
    const { page } = req.query;

    mediaType = normalizeMediaType(mediaType);

    const data = await tmdbApi.mediaList({
      mediaType,
      mediaCategory,
      page: page || 1
    });

    // data already contains results from TMDB via axios interceptor
    return responseHandler.ok(res, data);
  } catch (error) {
    console.error("Get List Error:", error instanceof Error ? error.message : JSON.stringify(error));
    return res.status(500).json({
      message: "Failed to load media",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// GET GENRES
const getGenres = async (req, res) => {
  try {
    let { mediaType } = req.params;
    mediaType = normalizeMediaType(mediaType);

    const data = await tmdbApi.mediaGenres({ mediaType });
    return responseHandler.ok(res, data);
  } catch (error) {
    console.error("Get Genres Error:", error instanceof Error ? error.message : JSON.stringify(error));
    return res.status(500).json({
      message: "Failed to load genres",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// GET DETAIL
const getDetail = async (req, res) => {
  try {
    let { mediaType, mediaId } = req.params;
    mediaType = normalizeMediaType(mediaType);

    const params = { mediaType, mediaId };
    const media = await tmdbApi.mediaDetail(params);

    media.credits = (await tmdbApi.mediaCredits(params)) || {};
    media.videos = (await tmdbApi.mediaVideos(params)) || {};
    media.images = (await tmdbApi.mediaImages(params)) || {};

    const recommend = await tmdbApi.mediaRecommend(params);
    media.recommend = recommend?.results || [];

    const tokenDecoded = tokenMiddleware.tokenDecode(req);
    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.data);
      if (user) {
        const isFavorite = await favoriteModel.findOne({
          user: user.id,
          mediaId
        });
        media.isFavorite = !!isFavorite;
      }
    }

    media.reviews = await reviewModel
      .find({ mediaId })
      .populate("user")
      .sort("-createdAt");

    return responseHandler.ok(res, media);
  } catch (error) {
    console.error("Media Detail Error:", error);
    return responseHandler.error(res, error.message);
  }
};

// SEARCH
const search = async (req, res) => {
  try {
    let { mediaType } = req.params;
    const { query, page } = req.query;

    console.log("Search Request - mediaType:", mediaType, "query:", query, "page:", page);

    mediaType = mediaType === "people" ? "person" : normalizeMediaType(mediaType);

    console.log("Normalized mediaType:", mediaType);

    const data = await tmdbApi.mediaSearch({ mediaType, query, page: page || 1 });
    
    console.log("Search API Response - results count:", data?.results?.length || 0);
    
    return responseHandler.ok(res, data);
  } catch (error) {
    console.error("Search Error Details:", {
      message: error.message,
      status: error.response?.status,
      config: error.config?.url
    });
    return responseHandler.error(res, error.message);
  }
};

export default {
  getList,
  getGenres,
  getDetail,
  search
};