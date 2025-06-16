const { Router } = require("express");
const User = require("../models/user");

const router = new Router();

router.get("/users", async (req, res, next) => {
  const { page = 1, itemsPerPage = 30, ...constraints } = req.query;
  try {
    res.json(
      await User.findAll({
        where: constraints,
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post("/users", async (req, res, next) => {
  try {
    const newUser = await User.create(req.body, {
      returning: true,
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
    const user = await User.findByPk(id);
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [nbUpdate, [updatedUser]] = await User.update(req.body, {
      where: {
        id,
      },
      returning: true,
    });
    if (nbUpdate === 0) return res.sendStatus(404);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const nbDelete = await User.destroy({
      where: {
        id,
      },
    });
    const updatedUser = await User.create(req.body);
    res.status(nbDelete === 0 ? 201 : 200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  const nbDelete = await User.destroy({
    where: {
      id,
    },
  });
  if (nbDelete === 0) return res.sendStatus(404);
  res.sendStatus(204);
});

module.exports = router;
