const express = require("express");
const router = express.Router();

const settingController = require("../controllers/settingController");
const uploadPictures = require("../middleware/pictureMiddleware");
router.get("/info", settingController.getSettingsInfo);
router.patch(
  "/update",

  uploadPictures.single("pictureFile"),
  settingController.updateProfile,
);
module.exports = router;
