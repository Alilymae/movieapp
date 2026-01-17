const baseUrl = process.env.TMDB_BASE_URL;
const key = process.env.TMDB_KEY;

// GET URL
const getUrl = (endpoint, params = {}) => {
  const qs = new URLSearchParams(params);
  return `${baseUrl}${endpoint}?api_key=${key}&${qs}`;
};

const mediaType = {
  movie: "movie",
  tv: "tv",
};

const mediaCategory = {
  popular: "popular",
  top_rated: "top_rated",
  upcoming: "upcoming",
};

export default { getUrl, mediaType, mediaCategory };
