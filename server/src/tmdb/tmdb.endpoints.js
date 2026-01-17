// TMDB ENDPOINTS
const tmdbEndpoints = {
    // MEDIA LIST
    mediaList: ({ mediaType, mediaCategory, page }) =>
        `${mediaType}/${mediaCategory}`,

    // MEDIA DETAIL URL
    mediaDetail: ({ mediaType, mediaId }) => `${mediaType}/${mediaId}`,
    // MEDIA CREDITS URL
    mediaCredits: ({ mediaType, mediaId }) => `${mediaType}/${mediaId}/credits`,
    // MEDIA GENRES URL
    mediaGenres: ({ mediaType }) => `genre/${mediaType}/list`,
    // MEDIA VIDEOS URL
    mediaVideos: ({ mediaType, mediaId }) => `${mediaType}/${mediaId}/videos`,
    // MEDIA IMAGES URL
    mediaImages: ({ mediaType, mediaId }) => `${mediaType}/${mediaId}/images`,
    // MEDIA RECOMMEND URL
    mediaRecommend: ({ mediaType, mediaId }) => `${mediaType}/${mediaId}/recommendations`,
    // MEDIA SEARCH URL
    mediaSearch: ({ mediaType, query, page }) => {
        const endpoint = `search/${mediaType}`;
        console.log("ENDPOINT mediaSearch called with mediaType:", mediaType, "returning:", endpoint);
        return endpoint;
    },
    personSearch: ({ query, page }) => `search/person`,
    personDetail: ({ personId }) => `person/${personId}`,
    personMedias: ({ personId }) => `person/${personId}/combined_credits`
};

export default tmdbEndpoints;
