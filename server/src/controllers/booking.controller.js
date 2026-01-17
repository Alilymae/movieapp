import Booking from "../models/booking.model.js";
import MovieSchedule from "../models/movieSchedule.model.js";
import SeatAvailability from "../models/seatAvailability.model.js";
import responseHandler from "../handlers/response.handler.js";

// GET SCHEDULES
export const getSchedules = async (req, res) => {
  try {
    const { tmdbId, date } = req.query;

    let query = { isActive: true };

    if (tmdbId) {
      query["movie.tmdbId"] = parseInt(tmdbId);
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.showDate = { $gte: startDate, $lte: endDate };
    }

    const schedules = await MovieSchedule.find(query).sort({ showDate: 1 });
    responseHandler.ok(res, schedules);
  } catch (error) {
    responseHandler.error(res, error.message);
  }
};

// GET SCHEDULE DETAIL
export const getScheduleDetail = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await MovieSchedule.findById(scheduleId);
    if (!schedule) {
      return responseHandler.notfound(res, "Schedule not found");
    }

    const seatAvailability = await SeatAvailability.findOne({
      movieSchedule: scheduleId,
    });

    responseHandler.ok(res, {
      schedule,
      seatAvailability: seatAvailability || null,
    });
  } catch (error) {
    responseHandler.error(res, error.message);
  }
};

// CREATE SCHEDULE
export const createSchedule = async (req, res) => {
  try {
    const {
      movie,
      theater,
      showDate,
      showTime,
      duration,
      language,
      format,
      pricePerSeat,
    } = req.body;

    const totalRows = theater.totalRows || 8;
    const seatsPerRow = theater.seatsPerRow || 10;
    const totalSeats = totalRows * seatsPerRow;

    const schedule = new MovieSchedule({
      movie,
      theater,
      showDate,
      showTime,
      duration,
      language,
      format,
      pricePerSeat,
      totalSeats,
      availableSeats: totalSeats,
    });

    await schedule.save();

    // Create seat availability
    const seats = [];
    for (let i = 0; i < totalRows; i++) {
      for (let j = 0; j < seatsPerRow; j++) {
        const seatLetter = String.fromCharCode(65 + i);
        seats.push({
          seatId: `${seatLetter}${j + 1}`,
          seatNumber: j + 1,
          seatLetter,
          isBooked: false,
        });
      }
    }

    const seatAvailability = new SeatAvailability({
      movieSchedule: schedule._id,
      seats,
    });

    await seatAvailability.save();

    responseHandler.created(res, {
      schedule,
      seatAvailability,
    });
  } catch (error) {
    responseHandler.error(res, error.message);
  }
};

// UPDATE SCHEDULE
export const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updates = req.body;

    const schedule = await MovieSchedule.findByIdAndUpdate(scheduleId, updates, {
      new: true,
    });

    if (!schedule) {
      return responseHandler.notfound(res, "Schedule not found");
    }

    responseHandler.ok(res, schedule);
  } catch (error) {
    responseHandler.error(res, error.message);
  }
};

// DELETE SCHEDULE
export const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await MovieSchedule.findByIdAndUpdate(
      scheduleId,
      { isActive: false },
      { new: true }
    );

    if (!schedule) {
      return responseHandler.notfound(res, "Schedule not found");
    }

    responseHandler.ok(res, { message: "Schedule deleted successfully" });
  } catch (error) {
    responseHandler.error(res, error.message);
  }
};

// BOOK SEATS
export const bookSeats = async (req, res) => {
  try {
    const { scheduleId, seats, paymentId } = req.body;
    const userId = req.user._id;

    const schedule = await MovieSchedule.findById(scheduleId);
    if (!schedule) {
      return responseHandler.notfound(res, "Schedule not found");
    }

    const seatAvailability = await SeatAvailability.findOne({
      movieSchedule: scheduleId,
    });

    if (!seatAvailability) {
      return responseHandler.notfound(res, "Seat availability not found");
    }

    // Check if seats are available
    const selectedSeats = [];
    let totalPrice = 0;

    for (const seatId of seats) {
      const seat = seatAvailability.seats.find((s) => s.seatId === seatId);

      if (!seat) {
        return responseHandler.error(res, `Seat ${seatId} not found`);
      }

      if (seat.isBooked) {
        return responseHandler.error(res, `Seat ${seatId} is already booked`);
      }

      selectedSeats.push({
        seatId: seat.seatId,
        seatNumber: seat.seatNumber,
        seatLetter: seat.seatLetter,
        price: schedule.pricePerSeat,
      });

      totalPrice += schedule.pricePerSeat;
      seat.isBooked = true;
    }

    // Create booking
    const bookingReference = `BK${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    const booking = new Booking({
      user: userId,
      movieSchedule: scheduleId,
      seats: selectedSeats,
      totalPrice,
      paymentId,
      paymentStatus: "completed",
      bookingReference,
    });

    await booking.save();

    // Update seat availability
    seatAvailability.seats = seatAvailability.seats.map((seat) => {
      if (seats.includes(seat.seatId)) {
        return { ...seat, isBooked: true, booking: booking._id };
      }
      return seat;
    });

    await seatAvailability.save();

    // Update available seats count
    schedule.availableSeats = schedule.totalSeats - seats.length;
    await schedule.save();

    responseHandler.created(res, booking);
  } catch (error) {
    responseHandler.error(res, error.message);
  }
};

// GET USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ user: userId })
      .populate("movieSchedule")
      .sort({ createdAt: -1 });

    responseHandler.ok(res, bookings);
  } catch (error) {
    responseHandler.error(res, error.message);
  }
};

// GET BOOKING DETAIL
export const getBookingDetail = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("movieSchedule");

    if (!booking) {
      return responseHandler.notfound(res, "Booking not found");
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return responseHandler.error(res, "Unauthorized");
    }

    responseHandler.ok(res, booking);
  } catch (error) {
    responseHandler.error(res, error.message);
  }
};

// CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return responseHandler.notfound(res, "Booking not found");
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return responseHandler.error(res, "Unauthorized");
    }

    if (booking.bookingStatus === "cancelled") {
      return responseHandler.error(res, "Booking is already cancelled");
    }

    // Release seats
    const seatAvailability = await SeatAvailability.findOne({
      movieSchedule: booking.movieSchedule,
    });

    const seatIds = booking.seats.map((s) => s.seatId);

    seatAvailability.seats = seatAvailability.seats.map((seat) => {
      if (seatIds.includes(seat.seatId)) {
        return { ...seat, isBooked: false, booking: null };
      }
      return seat;
    });

    await seatAvailability.save();

    // Update booking status
    booking.bookingStatus = "cancelled";
    await booking.save();

    // Update available seats
    const schedule = await MovieSchedule.findById(booking.movieSchedule);
    schedule.availableSeats += booking.seats.length;
    await schedule.save();

    responseHandler.ok(res, { message: "Booking cancelled successfully" });
  } catch (error) {
    responseHandler.error(res, error.message);
  }
};
