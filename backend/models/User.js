const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  city: String,
  platform: String,
  weeklyIncome: Number,
  risk: String,
  premium: Number
});

module.exports = mongoose.model("User", userSchema);