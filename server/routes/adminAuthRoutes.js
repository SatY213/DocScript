const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");
const {
  ensureAdminAuthenticated,
} = require("../middleware/adminAuthMiddleware");

// Register
router.post("/register", adminAuthController.register);

// Login
router.post("/login", adminAuthController.login);

// Logout
router.post("/logout", ensureAdminAuthenticated, adminAuthController.logout);

// Example of a protected route
router.get("/me", ensureAdminAuthenticated, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
    },
  });
});

module.exports = router;
