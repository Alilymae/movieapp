import express from "express";
import {
  getSchedules,
  getScheduleDetail,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  bookSeats,
  getUserBookings,
  getBookingDetail,
  cancelBooking,
} from "../controllers/booking.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

// BOOKING ROUTER
const router = express.Router();

// PUBLIC ENDPOINTS
router.get("/schedules", getSchedules);
router.get("/schedules/:scheduleId", getScheduleDetail);

// PROTECTED ENDPOINTS
router.post("/book", tokenMiddleware.auth, bookSeats);
router.get("/my-bookings", tokenMiddleware.auth, getUserBookings);
router.get("/booking/:bookingId", tokenMiddleware.auth, getBookingDetail);
router.put("/booking/:bookingId/cancel", tokenMiddleware.auth, cancelBooking);

// ADMIN ENDPOINTS
router.post("/schedules", tokenMiddleware.auth, createSchedule);
router.put("/schedules/:scheduleId", tokenMiddleware.auth, updateSchedule);
router.delete("/schedules/:scheduleId", tokenMiddleware.auth, deleteSchedule);

export default router;
