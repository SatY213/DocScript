const express = require("express");
const router = express.Router();

const articleController = require("../controllers/articleController");

router.get(
  "/",
  // authenticate,
  articleController.getAllArticles
);
router.post(
  "/",
  // authenticate,
  articleController.createArticle
);
router.get(
  "/:id",
  // authenticate,
  articleController.getArticleById
);

router.patch(
  "/:id",
  // authenticate,
  articleController.updateArticle
);
router.delete(
  "/:id",
  // authenticate,
  articleController.deleteArticle
);

module.exports = router;
