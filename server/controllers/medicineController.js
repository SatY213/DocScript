const Medicine = require("../models/medicine");
const { escapeRegex } = require("../utils/functions");

// ----------------------------------------------------
//  GET ALL MEDICINES
// ----------------------------------------------------

exports.getAllMedicines = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const searchQuery = req.query.q?.trim() || "";

    let sortName = req.query.sortName;
    let sortTherapeuticClass = req.query.sortTherapeuticClass;
    let sortDosage = req.query.sortDosage;

    sortName =
      sortName === "1" || sortName === "-1" ? Number(sortName) : undefined;
    sortTherapeuticClass =
      sortTherapeuticClass === "1" || sortTherapeuticClass === "-1"
        ? Number(sortTherapeuticClass)
        : undefined;
    sortDosage =
      sortDosage === "1" || sortDosage === "-1"
        ? Number(sortDosage)
        : undefined;

    const baseQuery = { user_ref: req.user.id };

    let query = baseQuery;

    if (searchQuery) {
      const safeRegex = new RegExp(escapeRegex(searchQuery), "i");

      query = {
        ...baseQuery,
        $or: [
          { name: safeRegex },
          { therapeuticClass: safeRegex },
          { dosage: safeRegex },
        ],
      };
    }

    const sortObj = {};
    if (sortName !== undefined) sortObj.name = sortName;
    if (sortTherapeuticClass !== undefined)
      sortObj.therapeuticClass = sortTherapeuticClass;
    if (sortDosage !== undefined) sortObj.dosage = sortDosage;

    sortObj.createdAt = -1;

    const [totalCount, medicines] = await Promise.all([
      Medicine.countDocuments(query),
      Medicine.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort(sortObj)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: medicines,
      stats: { total: totalCount },
      pagination: {
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        totalItems: medicines.length,
      },
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération des médicaments.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  CREATE MEDICINE
// ----------------------------------------------------
exports.createMedicine = async (req, res) => {
  try {
    req.body.user_ref = req.user.id;

    const newMedicine = new Medicine(req.body);

    const saved = await newMedicine.save();

    res.status(201).json({
      success: true,
      message: "Médicament créé avec succes.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la création du médicament.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  GET MEDICINE BY ID
// ----------------------------------------------------
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Médicament non trouvée." });
    }

    if (medicine.user_ref.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé." });
    }

    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    console.error("Error fetching medicine:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération du médicament.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  UPDATE MEDICINE
// ----------------------------------------------------
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Médicament non trouvé.",
      });
    }

    if (medicine.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Médicament mis à jour avec succès.",
      data: updatedMedicine,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la mise à jour du médicament.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  DELETE MEDICINE
// ----------------------------------------------------
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Médicament non trouvé." });
    }

    if (medicine.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    await medicine.deleteOne();

    res.status(200).json({
      success: true,
      message: "Médicament supprimé avec succès.",
    });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la suppression du médicament.",
      error: error.message,
    });
  }
};
