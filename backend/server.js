const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/giginsura")
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("GigInsura Backend Running");
});

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));