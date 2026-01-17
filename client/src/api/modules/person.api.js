import publicClient from "../client/public.client.js"

// PERSON ENDPOINTS
const personEndpoints = {
    detail: ({ personId }) => `person/${personId}`,
    medias: ({ personId }) => `person/${personId}/medias`
};

// PERSON API
const personApi = {
    // DETAIL
    detail: async ({ personId }) => {
        try {
            const response = await publicClient.get(personEndpoints.detail({ personId }));
            return { response };
        } catch (err) {
            return { err };
        }
    },
    // MEDIAS
    medias: async ({ personId }) => {
        try {
            const response = await publicClient.get(personEndpoints.medias({ personId }));
            return { response };
        } catch (err) {
            return { err };
        }
    }
};

export default personApi;