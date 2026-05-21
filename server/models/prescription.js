const mongoose = require("mongoose");
const { Schema } = mongoose;

// Prescription Schema
const prescriptionSchema = new Schema(
  {
    user_ref: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patient_ref: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    presribedMedicines: [
      {
        medicine: { type: String, required: true },
        instructions: { type: String },
      },
    ],
    note: { type: String },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
