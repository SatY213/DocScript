const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    user_ref: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patient_ref: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    start_time: {
      type: String, // e.g. "09:00"
      required: true,
    },

    duration: {
      type: Number, // store minutes as a number → easier for calculations
      required: true,
      default: 30,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "confirmed", "in_progress"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
