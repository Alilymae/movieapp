import privateClient from "../client/private.client.js";

// REVIEW ENDPOINTS
const reviewEndpoints = {
  list: "reviews",
  add: "reviews",
  remove: ({ reviewId }) => `reviews/${reviewId}`
};

// REVIEW API
const reviewApi = {
  add: async ({
    mediaId,
    mediaType,
    mediaTitle,
    mediaPoster,
    content
  }) => {
    // ADD REVIEW
    return await privateClient.post(
      reviewEndpoints.add,
      {
        mediaId,
        mediaType,
        mediaTitle,
        mediaPoster,
        content
      }
    );
  },

  // REMOVE
  remove: async ({ reviewId }) => {
    return await privateClient.delete(
      reviewEndpoints.remove({ reviewId })
    );
  },

  // GET LIST
  getList: async () => {
    return await privateClient.get(reviewEndpoints.list);
  }
};

export default reviewApi;
// DELETE YOURSELF PLS OMD