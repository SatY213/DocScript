const mongoose = require("mongoose");
const { Schema } = mongoose;

// Patient Schema
const patientSchema = new Schema(
  {
    user_ref: { type: Schema.Types.ObjectId, ref: "User", required: true },
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      birthDate: { type: Date, required: true },
      sexe: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String },
      civilState: { type: String },
      profession: { type: String },
      employer: { type: String },
      socialSecutiryNumber: { type: String },
      chifaCardNumber: { type: String },
    },
    medicalInfo: {
      bloodGroup: { type: String },
      weight: { type: Number },
      height: { type: Number },
      CranialPerimeter: { type: Number },
      medicalHistory: { type: String },
      drugAllergies: { type: String },
      chronicIllnesses: { type: String },
      medicalFollowUp: { type: String },
    },
    emergencyContact: {
      fullName: { type: String },
      relationship: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
