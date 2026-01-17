import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";

// CREATE REVIEW
const create = async (req, res) => {
    try {
        const review = new reviewModel({
            user: req.user.id,
            ...req.body
        });

        await review.save();

        return responseHandler.created(res, {
            ...review._doc,
            id: review.id,
            user: req.user
        });

    } catch (err) {
        console.error(err);
        responseHandler.error(res);
    }
};

// REMOVE REVIEW
const remove = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await reviewModel.findOne({
            _id: reviewId,
            user: req.user.id
        });

        if (!review) return responseHandler.notfound(res);

        await review.deleteOne();

        return responseHandler.ok(res);
    } catch (err) {
        console.error(err);
        responseHandler.error(res);
    }
};

// GET REVIEWS OF USER
const getReviewsOfUser = async (req, res) => {
    try {
        const reviews = await reviewModel
            .find({ user: req.user.id })
            .sort("-createdAt");

        return responseHandler.ok(res, reviews);
    } catch (err) {
        console.error(err);
        responseHandler.error(res);
    }
};

export default { create, remove, getReviewsOfUser };
