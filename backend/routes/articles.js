const { Router } = require("express");
const Article = require("../models/db/db").models.Article;
const checkAuth = require("../middlewares/checkAuth");
const checkRole = require("../middlewares/checkRole");

const router = new Router();

router.get(
  "/articles",
  checkAuth,
  checkRole("ROLE_USER"),
  async (req, res, next) => {
    const { page = 1, itemsPerPage = 30, ...constraints } = req.query;
    try {
      res.json(
        await Article.findAll({
          where: constraints,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post("/articles", async (req, res, next) => {
  try {
    const newArticle = await Article.create(req.body, {
      returning: true,
    });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/articles/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const article = await Article.findByPk(id);
    if (!article) return res.sendStatus(404);
    res.json(article);
  } catch (error) {
    next(error);
  }
});

router.patch("/articles/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [nbUpdate, [updatedArticle]] = await Article.update(req.body, {
      where: {
        id,
      },
      returning: true,
      individualHooks: true,
    });
    if (nbUpdate === 0) return res.sendStatus(404);
    res.json(updatedArticle);
  } catch (error) {
    next(error);
  }
});

router.put("/articles/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const nbDelete = await Article.destroy({
      where: {
        id,
      },
    });
    const updatedArticle = await Article.create(req.body);
    res.status(nbDelete === 0 ? 201 : 200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
});

router.delete("/articles/:id", async (req, res, next) => {
  const { id } = req.params;
  const nbDelete = await Article.destroy({
    where: {
      id,
    },
  });
  if (nbDelete === 0) return res.sendStatus(404);
  res.sendStatus(204);
});

module.exports = router;
