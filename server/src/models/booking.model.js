import mongoose, { Schema } from "mongoose";

// BOOKING SCHEMA
const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieSchedule: {
      type: Schema.Types.ObjectId,
      ref: "MovieSchedule",
      required: true,
    },
    seats: [
      {
        seatId: String,
        seatNumber: String,
        seatLetter: String,
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    paymentId: String,
    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
