const { Router } = require("express");
const User = require("../models/mongo/user");
const checkAuth = require("../middlewares/checkAuth");
const checkRole = require("../middlewares/checkRole");

const router = new Router();

router.get(
  "/users",
  checkAuth,
  checkRole("ROLE_USER"),
  async (req, res, next) => {
    const { page = 1, itemsPerPage = 30, ...constraints } = req.query;
    try {
      res.json(
        await User.find(constraints)
          .limit(itemsPerPage)
          .skip((page - 1) * itemsPerPage)
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post("/users", async (req, res, next) => {
  try {
    const newUser = await User.create(req.body, {
      new: true,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.updateOne({ _id: id }, req.body, {
      new: true,
    });
    if (!updatedUser) return res.sendStatus(404);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.replaceOne({ _id: id }, req.body);
    res.status(updatedUser.modifiedCount === 0 ? 201 : 200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  const nbDelete = await User.deleteOne({ _id: id });
  if (nbDelete.deletedCount === 0) return res.sendStatus(404);
  res.sendStatus(204);
});

module.exports = router;
