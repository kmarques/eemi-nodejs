const Mongoose = require("mongoose");
const connection = require("./mongo");

const userSchema = new Mongoose.Schema({
  _id: { type: Number },
  email: { type: String },
  password: { type: String },
  name: { type: String },
  Articles: [Object],
});

const User = connection.model("User", userSchema);

module.exports = User;
