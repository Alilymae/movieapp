import responseHandler from "../handlers/response.handler.js";
import favoriteModel from "../models/favorite.model.js";

// ADD FAVORITE
const addFavorite = async (req, res) => {
  try {
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId
    });

    if (isFavorite) {
      return responseHandler.ok(res, isFavorite);
    }

    const favorite = new favoriteModel({
      ...req.body,
      user: req.user.id
    });

    await favorite.save();

    return responseHandler.created(res, favorite);
  } catch (err) {
    console.error(err);
    responseHandler.error(res);
  }
};

// REMOVE FAVORITE
const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await favoriteModel.findOne({
      _id: favoriteId,
      user: req.user.id
    });

    if (!favorite) {
      return responseHandler.notfound(res);
    }

    await favorite.deleteOne();

    return responseHandler.ok(res);
  } catch (err) {
    console.error(err);
    responseHandler.error(res);
  }
};

// GET FAVORITES OF USER
const getFavoritesOfUser = async (req, res) => {
  try {
    const favorites = await favoriteModel
      .find({ user: req.user.id })
      .sort("-createdAt")
      .lean();

    const favoritesWithId = favorites.map(fav => ({
      ...fav,
      id: fav._id.toString()
    }));

    return responseHandler.ok(res, favoritesWithId);
  } catch (err) {
    console.error(err);
    responseHandler.error(res);
  }
};

export default { addFavorite, removeFavorite, getFavoritesOfUser };