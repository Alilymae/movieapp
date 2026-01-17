import publicClient from "../client/public.client.js";

// NORMALIZE MEDIA TYPE
const normalizeMediaType = (mediaType) => {
  if (["movie", "movies"].includes(mediaType)) return "movie";
  if (["tv", "series"].includes(mediaType)) return "tv";
  if (["person", "people"].includes(mediaType)) return "person";
  return mediaType; 
};

// GENRE API
const genreApi = {
  // GET LIST
  getList: async ({ mediaType }) => {
    mediaType = normalizeMediaType(mediaType);
    return await publicClient.get(`/${mediaType}/genres`);
  }
};

export default genreApi;