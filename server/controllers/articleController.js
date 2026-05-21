const Article = require("../models/article");

// ----------------------------------------------------
//  GET ALL MEDICINES
// ----------------------------------------------------

exports.getAllArticles = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const page = Math.max(1, parseInt(req.query.page, 10)) || 1;
    const searchQuery = req.query.q?.trim() || "";

    let sortName = req.query.sortName;
    let sortQuantity = req.query.sortQuantity;

    sortName =
      sortName === "1" || sortName === "-1" ? Number(sortName) : undefined;

    sortQuantity =
      sortQuantity === "1" || sortQuantity === "-1"
        ? Number(sortQuantity)
        : undefined;

    const query = { user_ref: req.user.id };

    if (searchQuery) {
      query.$or = [{ name: { $regex: searchQuery, $options: "i" } }];
    }

    const sortObj = {};
    if (sortName !== undefined) sortObj["name"] = sortName;

    if (sortQuantity !== undefined) sortObj["quantity"] = sortQuantity;

    const [totalCount, articles] = await Promise.all([
      Article.countDocuments(query),

      Article.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort(sortObj)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: articles,
      stats: { total: totalCount },
      pagination: {
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        totalItems: articles.length,
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération des articles.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  CREATE MEDICINE
// ----------------------------------------------------
exports.createArticle = async (req, res) => {
  try {
    req.body.user_ref = req.user.id;
    const newArticle = new Article(req.body);

    const saved = await newArticle.save();

    res.status(201).json({
      success: true,
      message: "Médicament créé avec succes.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la création de l'article.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  GET MEDICINE BY ID
// ----------------------------------------------------
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Médicament non trouvée." });
    }
    if (article.user_ref.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé." });
    }
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération de l'article.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  UPDATE MEDICINE
// ----------------------------------------------------
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article non trouvé." });
    }

    if (article.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Article mis à jour avec succès.",
      data: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({
      success: false,
      message: "Échec de la mise à jour de l'article.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  DELETE MEDICINE
// ----------------------------------------------------
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article non trouvé." });
    }

    if (article.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Article supprimé avec succès.",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({
      success: false,
      message: "Échec de la suppression de l'article.",
      error: error.message,
    });
  }
};
