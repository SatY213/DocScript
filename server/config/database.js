const mongoose = require("mongoose");
require("dotenv").config();
exports.loginMongoose = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("*** MongoDB connected successfully ***");
    })
    .catch((err) => {
      console.log("MongoDB URI:", process.env.MONGO_URI);
      console.error("Error connecting to MongoDB:", err);
    });
};
