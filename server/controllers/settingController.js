const User = require("../models/user");
// ----------------------------------------------------
//  GET SETTINGS INFO
// ----------------------------------------------------

exports.getSettingsInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password ").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvée.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération de l'utilisateur.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
// UPDATE PROFILE
// ----------------------------------------------------
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvée.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès.",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la mise à jour de l'utilisateur.",
      error: error.message,
    });
  }
};

exports.getUserAssistants = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("-password assistants")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvée.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Assistants récupérés avec succès.",
    });
  } catch (error) {
    console.error("Error fetching user assistants:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération des assistants de l'utilisateur.",
      error: error.message,
    });
  }
};
