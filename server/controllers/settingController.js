const User = require("../models/user");
const fs = require("fs");
const path = require("path");

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

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvée.",
      });
    }

    // 🔥 handle old image deletion
    if (req.file) {
      if (user.picture) {
        const oldPath = path.join(__dirname, "../pictures", user.picture);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // assign new filename
      req.body.picture = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .lean();

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès.",
      data: updatedUser,
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
