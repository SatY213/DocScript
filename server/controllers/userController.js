const User = require("../models/user");
const Prescription = require("../models/prescription");
// ----------------------------------------------------
//  GET ALL USERS
// ----------------------------------------------------

exports.getAllUsers = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const page = Math.max(1, parseInt(req.query.page, 10)) || 1;
    const searchQuery = req.query.q?.trim() || "";

    let sortBirthDate = req.query.sortBirthDate;
    let sortLastName = req.query.sortLastName;

    sortBirthDate =
      sortBirthDate === "1" || sortBirthDate === "-1"
        ? Number(sortBirthDate)
        : undefined;
    sortLastName =
      sortLastName === "1" || sortLastName === "-1"
        ? Number(sortLastName)
        : undefined;

    const query = {};

    if (searchQuery) {
      query.$or = [
        { "personalInfo.firstName": { $regex: searchQuery, $options: "i" } },
        { "personalInfo.lastName": { $regex: searchQuery, $options: "i" } },
        { "personalInfo.email": { $regex: searchQuery, $options: "i" } },
        { "personalInfo.phone": { $regex: searchQuery, $options: "i" } },
      ];
    }

    const sortObj = {};
    if (sortBirthDate !== undefined)
      sortObj["personalInfo.birthDate"] = sortBirthDate;
    if (sortLastName !== undefined)
      sortObj["personalInfo.lastName"] = sortLastName;
    sortObj["createdAt"] = -1;

    const [totalCount, users] = await Promise.all([
      User.countDocuments(query),

      User.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort(sortObj)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      stats: { total: totalCount },
      pagination: {
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        totalItems: users.length,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération des utilisateurs.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  CREATE USER
// ----------------------------------------------------
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);

    const saved = await newUser.save();

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succes.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la création de l'utilisateur.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  GET USER BY ID
// ----------------------------------------------------
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User non trouvée.",
      });
    }

    const prescriptions = await Prescription.find({
      user_ref: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    user.prescriptions = prescriptions;

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
//  UPDATE USER
// ----------------------------------------------------
exports.updateUser = async (req, res) => {
  try {
    // Proceed with update
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );

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

// ----------------------------------------------------
//  DELETE USER
// ----------------------------------------------------
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User non trouvée." });
    }

    res
      .status(200)
      .json({ success: true, message: "User supprimé avec succès." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la suppression de l'utilisateur.",
      error: error.message,
    });
  }
};
