const db = require("./models/db/db");
const User = require("./models/db/user");
const Article = require("./models/db/article");

db.sync({
  alter: true,
})
  .then(() => console.log("Database updated"))
  .then(() => db.close());
