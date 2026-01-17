import axiosInstance from './axiosInstance'

const bookingEndpoints = {
  schedules: 'bookings/schedules',
  scheduleDetail: ({ scheduleId }) => `bookings/schedules/${scheduleId}`,
  createSchedule: 'bookings/schedules',
  updateSchedule: ({ scheduleId }) => `bookings/schedules/${scheduleId}`,
  deleteSchedule: ({ scheduleId }) => `bookings/schedules/${scheduleId}`,
}

const bookingApi = {
  // Get all schedules
  getSchedules: async (params = {}) => {
    try {
      const response = await axiosInstance.get(bookingEndpoints.schedules, {
        params,
      })
      return response.data
    } catch (error) {
      return { error: true, message: error.message }
    }
  },

  // Get schedule details
  getScheduleDetail: async (scheduleId) => {
    try {
      const response = await axiosInstance.get(
        bookingEndpoints.scheduleDetail({ scheduleId })
      )
      return response.data
    } catch (error) {
      return { error: true, message: error.message }
    }
  },

  // Create schedule
  createSchedule: async (scheduleData) => {
    try {
      const response = await axiosInstance.post(
        bookingEndpoints.createSchedule,
        scheduleData
      )
      return response.data
    } catch (error) {
      return { error: true, message: error.response?.data?.message || error.message }
    }
  },

  // Update schedule
  updateSchedule: async (scheduleId, updates) => {
    try {
      const response = await axiosInstance.put(
        bookingEndpoints.updateSchedule({ scheduleId }),
        updates
      )
      return response.data
    } catch (error) {
      return { error: true, message: error.response?.data?.message || error.message }
    }
  },

  // Delete schedule
  deleteSchedule: async (scheduleId) => {
    try {
      const response = await axiosInstance.delete(
        bookingEndpoints.deleteSchedule({ scheduleId })
      )
      return response.data
    } catch (error) {
      return { error: true, message: error.response?.data?.message || error.message }
    }
  },
}

export default bookingApi
