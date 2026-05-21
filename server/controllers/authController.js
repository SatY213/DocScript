const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");

// ================================
// REGISTER USER
// ================================
exports.register = async (req, res) => {
  try {
    const { title, fullName, specialty, firmName, email, phone, password } =
      req.body;

    // Check if the email exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "l'Email est deja utilisé.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      title,
      fullName,
      specialty,
      firmName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Utilisateur enregistré.",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'enregistrement.",
    });
  }
};

// ================================
// LOGIN USER
// ================================
exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: info?.message || "Erreur lors de l'authentification.",
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        success: true,
        message: "Utilisateur authentifié.",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

// ================================
// LOGOUT USER
// ================================
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la deconnexion.",
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
// GET LOGGED-IN USER
// ================================
exports.getUser = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Utilisateur non authentifié.",
    });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      title: req.user.title,
      specialty: req.user.specialty,
      firmName: req.user.firmName,
      phone: req.user.phone,
    },
  });
};
