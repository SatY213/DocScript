const mongoose = require("mongoose");
const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    user_ref: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    category: { type: String },
    amount: { type: Number },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
