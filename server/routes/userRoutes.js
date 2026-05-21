const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get(
  "/",
  // authenticate,
  userController.getAllUsers
);
router.post(
  "/",
  // authenticate,
  userController.createUser
);

router.get(
  "/:id",
  // authenticate,
  userController.getUserById
);

router.patch(
  "/:id",
  // authenticate,
  userController.updateUser
);
router.delete(
  "/:id",
  // authenticate,
  userController.deleteUser
);

module.exports = router;
