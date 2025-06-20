const db = require("./models/db");
const User = require("./models/user");

db.sync({
  alter: true,
})
  .then(() => console.log("Database updated"))
  .then(() => db.close());
