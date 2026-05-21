const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const articleSchema = new mongoose.Schema(
  {
    user_ref: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    quantity: { type: Number },
    unit: { type: String },
    lowQuantity: { type: Number },
  },
  { timestamps: true }
);
//test

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
