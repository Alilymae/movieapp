import privateClient from "../client/private.client.js";
import publicClient from "../client/public.client.js";

// BOOKING ENDPOINTS
const bookingEndpoints = {
  schedules: "bookings/schedules",
  scheduleDetail: ({ scheduleId }) => `bookings/schedules/${scheduleId}`,
  bookSeats: "bookings/book",
  myBookings: "bookings/my-bookings",
  bookingDetail: ({ bookingId }) => `bookings/booking/${bookingId}`,
  cancelBooking: ({ bookingId }) => `bookings/booking/${bookingId}/cancel`,
  createSchedule: "bookings/schedules",
  updateSchedule: ({ scheduleId }) => `bookings/schedules/${scheduleId}`,
  deleteSchedule: ({ scheduleId }) => `bookings/schedules/${scheduleId}`,
};

// BOOKING API
const bookingApi = {
  // GET SCHEDULES
  getSchedules: async (params) => {
    try {
      const response = await publicClient.get(bookingEndpoints.schedules, {
        params,
      });
      return response;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  // SCHEDULE DETAIL
  getScheduleDetail: async (scheduleId) => {
    try {
      const response = await publicClient.get(
        bookingEndpoints.scheduleDetail({ scheduleId })
      );
      return response;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  // BOOK SEATS
  bookSeats: async (scheduleId, seats, paymentId) => {
    try {
      const response = await privateClient.post(bookingEndpoints.bookSeats, {
        scheduleId,
        seats,
        paymentId,
      });
      return response;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  // GET USER BOOKINGS
  getUserBookings: async () => {
    try {
      const response = await privateClient.get(bookingEndpoints.myBookings);
      return response;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  // GET BOOKING DETAIL
  getBookingDetail: async (bookingId) => {
    try {
      const response = await privateClient.get(
        bookingEndpoints.bookingDetail({ bookingId })
      );
      return response;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  // CANCEL BOOKING
  cancelBooking: async (bookingId) => {
    try {
      const response = await privateClient.put(
        bookingEndpoints.cancelBooking({ bookingId })
      );
      return response;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  //CRATE SCHED ADMIN
  createSchedule: async (scheduleData) => {
    try {
      const response = await privateClient.post(
        bookingEndpoints.createSchedule,
        scheduleData
      );
      return response;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  // UPDATE SCHEDULE
  updateSchedule: async (scheduleId, updates) => {
    try {
      const response = await privateClient.put(
        bookingEndpoints.updateSchedule({ scheduleId }),
        updates
      );
      return response;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  // DELETE SCHEDULE
  deleteSchedule: async (scheduleId) => {
    try {
      const response = await privateClient.delete(
        bookingEndpoints.deleteSchedule({ scheduleId })
      );
      return response;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },
};

export default bookingApi;
