const bcrypt = require("bcrypt");
const passport = require("passport");
const Admin = require("../models/admin");

// ================================
// REGISTER ADMIN
// ================================
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Check if email exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await Admin.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Administrateur enregistré.",
      admin: {
        id: newAdmin._id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error("Admin Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'enregistrement.",
    });
  }
};

// ================================
// LOGIN ADMIN
// ================================
exports.login = (req, res, next) => {
  passport.authenticate("admin-local", (err, admin, info) => {
    if (err) return next(err);

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: info?.message || "Erreur lors de l'authentification.",
      });
    }

    req.logIn(admin, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        success: true,
        message: "Administrateur authentifié.",
        admin: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
        },
      });
    });
  })(req, res, next);
};

// ================================
// LOGOUT ADMIN
// ================================
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la déconnexion.",
      });
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.status(200).json({
        success: true,
        message: "Déconnexion effectuée.",
      });
    });
  });
};

// ================================
// GET LOGGED-IN ADMIN
// ================================
exports.getAdmin = (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({
      success: false,
      message: "Administrateur non authentifié.",
    });
  }

  return res.status(200).json({
    success: true,
    admin: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
    },
  });
};
