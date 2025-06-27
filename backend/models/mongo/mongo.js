const Mongoose = require("mongoose");

console.log("Connecting to MongoDB...", process.env.MONGO_URL);
Mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = Mongoose;
