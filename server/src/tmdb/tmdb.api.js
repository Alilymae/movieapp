import axiosClient from "../axios/axios.client.js";
import tmdbEndpoints from "./tmdb.endpoints.js";

// TMDB API
const tmdbApi = {
  // MEDIA LIST
  mediaList: async ({ mediaType, mediaCategory, page }) =>
    await axiosClient.get(
      tmdbEndpoints.mediaList({ mediaType, mediaCategory, page }),
      { params: { page: parseInt(page) || 1 } }
    ),

  // MEDIA DETAIL
  mediaDetail: async ({ mediaType, mediaId }) =>
    await axiosClient.get(
      tmdbEndpoints.mediaDetail({ mediaType, mediaId })
    ),
// MEDIA CREDITS
  
  mediaCredits: async ({ mediaType, mediaId }) =>
    await axiosClient.get(
      tmdbEndpoints.mediaCredits({ mediaType, mediaId })
    ),
// MEDIA GENRES
  
  mediaGenres: async ({ mediaType }) =>
    await axiosClient.get(
      tmdbEndpoints.mediaGenres({ mediaType })
    ),
// MEDIA VIDEOS
  
  mediaVideos: async ({ mediaType, mediaId }) =>
    await axiosClient.get(
      tmdbEndpoints.mediaVideos({ mediaType, mediaId })
    ),

  mediaImages: async ({ mediaType, mediaId }) =>
    await axiosClient.get(
      tmdbEndpoints.mediaImages({ mediaType, mediaId })
    ),

  mediaRecommend: async ({ mediaType, mediaId }) =>
    await axiosClient.get(
      tmdbEndpoints.mediaRecommend({ mediaType, mediaId })
    ),

  mediaSearch: async ({ mediaType, query, page }) => {
    const params = {
      query,
      page: parseInt(page) || 1
    };
    console.log("Direct mediaSearch - mediaType:", mediaType, "params:", params);
    return await axiosClient.get(`search/${mediaType}`, { params });
  },

  personSearch: async ({ query, page }) => {
    const params = {
      query,
      page: parseInt(page) || 1
    };
    return await axiosClient.get(
      tmdbEndpoints.personSearch({ query, page }),
      { params }
    );
  },

  personDetail: async ({ personId }) =>
    await axiosClient.get(
      tmdbEndpoints.personDetail({ personId })
    ),

  personMedias: async ({ personId }) =>
    await axiosClient.get(
      tmdbEndpoints.personMedias({ personId })
    )
};

export default tmdbApi;