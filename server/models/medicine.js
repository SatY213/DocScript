const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const medicineSchema = new mongoose.Schema(
  {
    user_ref: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    therapeuticClass: { type: String },
    dosage: { type: String },
    shapes: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);
//test

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
