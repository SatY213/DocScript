const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    picture: {
      type: String,
    },
    title: {
      type: String,
      enum: ["Dr", "Pr"],
    },
    fullName: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
    },
    firmName: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    picture: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    cnom: {
      type: String,
    },
    nif: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    assistants: [
      {
        active: { type: Boolean, default: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        password: { type: String, required: true },
        permissions: [
          {
            route: { type: String, required: true },
            canView: { type: Boolean, default: false },
            canEdit: { type: Boolean, default: false },
          },
        ],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
