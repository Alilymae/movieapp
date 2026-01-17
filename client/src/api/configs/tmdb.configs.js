// TMDB CONFIGS 
// MEDIA TYPOES IF TV OR MOVIE
const mediaType = {
    movie: "movie",
    tv: "tv"
};

//CATEGS
const mediaCategory = {
    popular: "popular",
    top_rated: "top_rated"
};

// IMG PATH
const backdropPath = (imgEndpoint) => `https://image.tmdb.org/t/p/original${imgEndpoint}`;

const posterPath = (imgEndpoint) => `https://image.tmdb.org/t/p/w500${imgEndpoint}`;

const youtubePath = (videoId) => `https://www.youtube.com/embed/${videoId}?controls=0`;

const tmdbConfigs = {
    mediaType,
    mediaCategory,
    backdropPath,
    posterPath,
    youtubePath
};

export default tmdbConfigs;
//DONE