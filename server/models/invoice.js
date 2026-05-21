const mongoose = require("mongoose");
const { Schema } = mongoose;
// Counter Schema
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", CounterSchema);
const invoiceSchema = new Schema(
  {
    user_ref: { type: Schema.Types.ObjectId, ref: "User", required: true },
    invoiceNumber: { type: String },
    patient_ref: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    description: { type: String },
    amount: { type: Number },
    status: { type: String, enum: ["pending", "paid"], default: "paid" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate invoice number before save
invoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "invoice" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const padded = String(counter.seq).padStart(6, "0"); // -> "000001"
      this.invoiceNumber = `INV-${padded}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
