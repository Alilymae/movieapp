import privateClient from "../client/private.client";

// FAVORITE ENDPOINTS
const favoriteEndpoints = {
    list: "user/favorites",
    add: "user/favorites",
    remove: ({ favoriteId }) => `user/favorites/${favoriteId}`
};

// FAVORITE API
const favoriteApi = {
    // GET LIST
    getList: async () => {
        return await privateClient.get(favoriteEndpoints.list);
    },
    add: async ({
        mediaId,
        mediaType,
        mediaTitle,
        mediaPoster,
        mediaRate
    }) => {
        return await privateClient.post(
            favoriteEndpoints.add,
            {
                mediaId,
                mediaType,
                mediaTitle,
                mediaPoster,
                mediaRate
            }
        );
    },
    remove: async ({ favoriteId }) => {
        return await privateClient.delete(favoriteEndpoints.remove({ favoriteId }));
    }
};

export default favoriteApi;