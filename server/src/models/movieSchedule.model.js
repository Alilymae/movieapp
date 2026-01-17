import mongoose, { Schema } from "mongoose";

// MOVIE SCHEDULE SCHEMA
const movieScheduleSchema = new Schema(
  {
    movie: {
      tmdbId: Number,
      title: String,
      posterPath: String,
      releaseDate: String,
    },
    theater: {
      name: String,
      location: String,
      totalRows: {
        type: Number,
        default: 8,
      },
      seatsPerRow: {
        type: Number,
        default: 10,
      },
    },
    showDate: {
      type: Date,
      required: true,
    },
    showTime: {
      type: String,
      required: true,
    },
    duration: Number,
    language: {
      type: String,
      default: "English",
    },
    format: {
      type: String,
      enum: ["2D", "3D", "IMAX"],
      default: "2D",
    },
    pricePerSeat: {
      type: Number,
      required: true,
      default: 10,
    },
    totalSeats: {
      type: Number,
      default: 80,
    },
    availableSeats: {
      type: Number,
      default: 80,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MovieSchedule", movieScheduleSchema);
