const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register User
router.post("/register", async (req, res) => {
  const { name, phone, city, platform, weeklyIncome } = req.body;

  // simple risk logic (AI placeholder)
  let risk = "low";
  let premium = 20;

  if (city === "Delhi") {
    risk = "high";
    premium = 40;
  }

  const user = new User({
    name,
    phone,
    city,
    platform,
    weeklyIncome,
    risk,
    premium
  });

  await user.save();

  res.json({
    message: "User registered",
    user
  });
});

module.exports = router;