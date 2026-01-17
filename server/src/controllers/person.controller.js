import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";

// PERSON DETAIL
const personDetail = async (req, res) => {
    try {
        const { personId } = req.params;
        const person = await tmdbApi.personDetail({ personId })

        responseHandler.ok( res, person);
    } catch {
        responseHandler.error(res)
    }
};

// PERSON MEDIAS
const personMedias = async (req, res) => {
    try {
        const { personId } = req.params;
        const medias = await tmdbApi.personMedias({ personId })

        responseHandler.ok( res, medias);
    } catch {
        responseHandler.error(res)
    }
};

// PERSON SEARCH
const personSearch = async (req, res) => {
    try {
        const { query, page } = req.query;
        const result = await tmdbApi.personSearch({ query, page });
        responseHandler.ok(res, result);
    } catch {
        responseHandler.error(res);
    }
};

export default { personDetail, personMedias, personSearch };