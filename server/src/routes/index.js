import express from "express";
import userRoute from "./user.routes.js"
import mediaRoute from "./media.routes.js"
import personRoute from "./person.route.js"
import reviewRoute from "./review.routes.js"
import bookingRoute from "./booking.routes.js"

// API ROUTES
const router = express.Router();

router.use("/user", userRoute);
router.use("/person", personRoute);
router.use("/reviews", reviewRoute);
router.use("/bookings", bookingRoute);
router.use("/:mediaType", mediaRoute);

export default router;