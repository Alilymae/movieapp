import mongoose, { Schema } from "mongoose";

// SEAT AVAILABILITY SCHEMA
const seatAvailabilitySchema = new Schema(
  {
    movieSchedule: {
      type: Schema.Types.ObjectId,
      ref: "MovieSchedule",
      required: true,
    },
    seats: [
      {
        seatId: String,
        seatNumber: Number,
        seatLetter: String,
        isBooked: {
          type: Boolean,
          default: false,
        },
        booking: {
          type: Schema.Types.ObjectId,
          ref: "Booking",
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("SeatAvailability", seatAvailabilitySchema);
