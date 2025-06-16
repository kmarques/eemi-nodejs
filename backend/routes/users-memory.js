const { Router } = require("express");
const router = new Router();

const users = [];

//function parseBody(req, res, next) {
//  const data = [];
//  req.on("data", function (chunk) {
//    data.push(chunk);
//  });
//
//  req.on("end", function () {
//    // Aggregation
//    const aggregatedData = Buffer.concat(data);
//
//    // Parsing
//    let parsedData;
//    if (req.headers["content-type"].match(/(application|text)\/json/i)) {
//      parsedData = JSON.parse(aggregatedData);
//    } else if (req.headers["content-type"].match(/(application|text)\/html/i)) {
//      parsedData = new JSDOM(aggregatedData).window.document;
//    } else {
//      parsedData = aggregatedData;
//    }
//
//    req.body = parsedData;
//    next();
//  });
//}
router.get("/users", (req, res, next) => {
  res.json(users);
});

router.post("/users", (req, res, next) => {
  const errors = {};

  if (!req.body.email) {
    errors.email = ["Invalid email", "Email already exists"];
  }
  if (!req.body.password) {
    errors.password = ["Invalid password"];
  }
  if (Object.keys(errors).length) {
    return res.status(422).json(errors);
  }

  const newUser = {
    id: Date.now(),
    ...req.body,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

router.get("/users/:id", (req, res, next) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  res.json(user);
});

router.patch("/users/:id", (req, res, next) => {
  const { id } = req.params;
  const errors = {};
  if (
    req.body.email &&
    !/[^\s\t\r\n]@[^\s\t\r\n]\.[^\s\t\r\n]/.test(req.body.email)
  ) {
    errors.email = ["Invalid email"];
  }
  if (Object.keys(errors).length) {
    return res.status(422).json(errors);
  }
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return res.sendStatus(404);
  const updatedUser = {
    ...users[userIndex],
    ...req.body,
  };
  users.splice(userIndex, 1, updatedUser);
  res.json(updatedUser);
});

router.put("/users/:id", (req, res, next) => {
  const errors = {};
  if (!req.body.email) {
    errors.email = ["Invalid email", "Email already exists"];
  }
  if (!req.body.password) {
    errors.password = ["Invalid password"];
  }
  if (Object.keys(errors).length) {
    return res.status(422).json(errors);
  }
  const { id } = req.params;
  const userIndex = users.findIndex((user) => user.id === id);
  const updatedUser = { ...req.body, id };
  if (userIndex === -1) {
    users.push(updatedUser);
    res.status(201).json(updatedUser);
  } else {
    users.splice(userIndex, 1, updatedUser);
    res.json(updatedUser);
  }
});

router.delete("/users/:id", (req, res, next) => {
  const { id } = req.params;
  const userIndex = users.findIndex((user) => user.id === id);
  users.splice(userIndex, 1);
  res.sendStatus(204);
});

module.exports = router;
