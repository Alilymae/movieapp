import publicClient from "../client/public.client.js";

// NORMALIZE MEDIA TYPE
const normalizeMediaType = (mediaType) => {
  if (["movie", "movies"].includes(mediaType)) return "movie";
  if (["tv", "series"].includes(mediaType)) return "tv";
  if (["person", "people"].includes(mediaType)) return "person";
  return mediaType; 
};

// MEDIA API
const mediaApi = {
  // GET LIST
  getList: async ({ mediaType, mediaCategory, page }) => {
    mediaType = normalizeMediaType(mediaType);
    return await publicClient.get(`/${mediaType}/${mediaCategory}`, {
      params: { page }
    });
  },

  // GET GENRES
  getGenres: async ({ mediaType }) => {
    mediaType = normalizeMediaType(mediaType);
    return await publicClient.get(`/${mediaType}/genres`);
  },

  // GET DETAIL
  getDetail: async ({ mediaType, mediaId }) => {
    mediaType = normalizeMediaType(mediaType);
    return await publicClient.get(`/${mediaType}/detail/${mediaId}`);
  },

  // SEARCH
  search: async ({ mediaType, query, page }) => {
    mediaType = mediaType === "people" ? "person" : normalizeMediaType(mediaType);
    return await publicClient.get(`/${mediaType}/search`, {
      params: { query, page }
    });
  }
};

export default mediaApi;
