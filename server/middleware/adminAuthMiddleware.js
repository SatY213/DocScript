exports.ensureAdminAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Administrateur non authentifié.",
  });
};
