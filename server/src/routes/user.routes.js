import express from "express"
import { body } from "express-validator"
import favoriteController from "../controllers/favorite.controller.js"
import userController from "../controllers/user.controller.js"
import requestHandler from "../handlers/request.handler.js"
import userModel from "../models/user.model.js"
import tokenMiddleware from "../middlewares/token.middleware.js"

// USER ROUTER
const router = express.Router()

// SIGNUP ENDPOINT
router.post(
    "/signup",
    body("username").exists().withMessage("Username is required")
        .isLength({ min: 8 }).withMessage("Username should contain a minimum of 8 characters").custom(async value => {
            const user = await userModel.findOne({ username: value });
            if (user) return Promise.reject("username already used");
        }),
    body("password").exists().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password should contain a minimum 8 characters"),
    body("displayName").exists().withMessage("Display Name is required")
        .isLength({ min: 4 }).withMessage("Display Name should contain a minimum 4 characters"),
    requestHandler.validate,
    userController.signup
);
// SIGNIN ENDPOINT

router.post(
    "/signin",
    body("username").exists().withMessage("Username is required")
        .isLength({ min: 8 }).withMessage("Username should contain a minimum of 8 characters"),
    body("password").exists().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Username should contain a minimum of 8 characters"),
    requestHandler.validate,
    userController.signin
);

router.put(
    "/update-password",
    tokenMiddleware.auth,
    body("password")
        .exists().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password should contain a minimum of 8 characters"),
    body("newPassword")
        .exists().withMessage("New Password is required")
        .isLength({ min: 8 }).withMessage("New password should contain a minimum of 8 characters"),
    body("confirmNewPassword")
        .exists().withMessage("Please confirm your new password")
        .isLength({ min: 8 }).withMessage("New password should contain a minimum of 8 characters")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) throw new Error("Confirm Password does not match");
            return true;
        }),
    requestHandler.validate,
    userController.updatePassword
);

router.get(
    "/info",
    tokenMiddleware.auth,
    userController.getInfo
);

router.get(
    "/favorites",
    tokenMiddleware.auth,
    favoriteController.getFavoritesOfUser
);

router.post(
    "/favorites",
    tokenMiddleware.auth,
    body("mediaType")
        .exists().withMessage("mediatype is required")
        .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalid"),
    body("mediaId")
        .exists().withMessage("mediaId required")
        .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
    body("mediaTitle")
        .exists().withMessage("mediaTitle is required"),
    body("mediaPoster")
        .exists().withMessage("mediaPoster is required"),
    body("mediaRate")
        .exists().withMessage("mediaRate is required"),
    requestHandler.validate,
    favoriteController.addFavorite
);

router.delete(
    "/favorites/:favoriteId",
    tokenMiddleware.auth,
    favoriteController.removeFavorite
);

export default router;