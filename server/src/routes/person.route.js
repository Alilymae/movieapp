import express from "express"
import personController from "../controllers/person.controller.js"

// PERSON ROUTES
const router = express.Router({ mergeParams: true });

router.get("/search", personController.personSearch);

router.get("/:personId/medias", personController.personMedias);

router.get("/:personId", personController.personDetail);

export default router;