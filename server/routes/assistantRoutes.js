const express = require("express");
const router = express.Router();

const assistantController = require("../controllers/assistantController");
router.post("/add", assistantController.addAssistant);

module.exports = router;
