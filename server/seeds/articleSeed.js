const mongoose = require("mongoose");
const Article = require("../models/article"); // ajuste le chemin

const MONGO_URI = "mongodb://127.0.0.1:27017/docscript";
const USER_ID = new mongoose.Types.ObjectId("69654be2904a82ff40c71105");

// helpers
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const articleNames = [
  "Paracétamol",
  "Ibuprofène",
  "Amoxicilline",
  "Seringue",
  "Gants médicaux",
  "Masque chirurgical",
  "Alcool médical",
  "Bandage",
  "Sérum physiologique",
  "Thermomètre",
  "Antibiotique",
  "Antiseptique",
  "Crème cicatrisante",
  "Vitamine C",
  "Solution saline",
];

const units = ["boîte", "pièce", "flacon", "tube", "carton"];

const genererArticle = () => {
  const name = randomItem(articleNames);

  const quantity = Math.floor(1 + Math.random() * 200);
  const lowQuantity = Math.floor(5 + Math.random() * 20);

  return {
    user_ref: USER_ID,
    name,
    quantity,
    unit: randomItem(units),
    lowQuantity,
  };
};

const seedArticles = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connecté à la base de données");

    const articles = [];

    for (let i = 0; i < 100; i++) {
      articles.push(genererArticle());
    }

    await Article.insertMany(articles);

    console.log("✅ 100 articles insérés avec succès");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedArticles();
