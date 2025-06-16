const db = require("./models/db");

db.sync({
  alter: true,
})
  .then(() => console.log("Database updated"))
  .then(() => db.close());
