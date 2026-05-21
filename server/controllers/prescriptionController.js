const Prescription = require("../models/prescription");
const Patient = require("../models/patient");
const Medicine = require("../models/medicine");
const mongoose = require("mongoose");
const { escapeRegex } = require("../utils/functions");
// ----------------------------------------------------
//  GET ALL PRESCRIPTIONS
// ----------------------------------------------------

exports.getAllPrescriptions = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const searchQuery = req.query.q?.trim() || "";

    const skip = (page - 1) * perPage;

    const sortObj = {
      createdAt: -1,
    };

    if (req.query.sortName) sortObj.name = Number(req.query.sortName);

    if (req.query.sortTherapeuticClass)
      sortObj.therapeuticClass = Number(req.query.sortTherapeuticClass);

    if (req.query.sortDosage) sortObj.dosage = Number(req.query.sortDosage);

    const pipeline = [
      {
        $match: {
          user_ref: new mongoose.Types.ObjectId(req.user.id),
        },
      },

      // JOIN patient
      {
        $lookup: {
          from: "patients",
          localField: "patient_ref",
          foreignField: "_id",
          as: "patient_ref",
        },
      },

      {
        $unwind: {
          path: "$patient_ref",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    // SEARCH
    if (searchQuery) {
      const safeRegex = new RegExp(escapeRegex(searchQuery), "i");

      pipeline.push({
        $match: {
          $or: [
            { name: safeRegex },
            { therapeuticClass: safeRegex },
            { note: safeRegex },

            // patient search
            {
              "patient_ref.personalInfo.firstName": safeRegex,
            },
            {
              "patient_ref.personalInfo.lastName": safeRegex,
            },
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $concat: [
                      "$patient_ref.personalInfo.firstName",
                      " ",
                      "$patient_ref.personalInfo.lastName",
                    ],
                  },
                  regex: safeRegex,
                },
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: sortObj },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: perPage }],
          totalCount: [{ $count: "count" }],
        },
      },
    );

    const result = await Prescription.aggregate(pipeline);

    const prescriptions = result?.[0]?.data || [];
    const totalCount = result?.[0]?.totalCount?.[0]?.count || 0;

    return res.status(200).json({
      success: true,
      data: prescriptions,
      stats: { total: totalCount },
      pagination: {
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        totalItems: totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);

    return res.status(500).json({
      success: false,
      message: "Echec de la récupération des ordonnances.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  CREATE PRESCRIPTION
// ----------------------------------------------------
exports.createPrescription = async (req, res) => {
  try {
    req.body.user_ref = req.user.id;
    const newPrescription = new Prescription(req.body);

    const saved = await newPrescription.save();

    res.status(201).json({
      success: true,
      message: "Ordonnance créée avec succes.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la création de l'ordonnance.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  GET PRESCRIPTION BY ID
// ----------------------------------------------------
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate(
      "patient_ref",
      "personalInfo medicalInfo.height medicalInfo.weight",
    );

    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Ordonnance non trouvée." });
    }
    if (prescription.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }
    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération de l'ordonnance.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  UPDATE PRESCRIPTION
// ----------------------------------------------------
exports.updatePrescription = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(400).json({
        success: false,
        message: "Vous devez vous connecter.",
      });
    }

    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Ordonnance non trouvée.",
      });
    }

    if (prescription.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Ordonnance mise à jour avec succès.",
      data: updatedPrescription,
    });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la mise à jour de l'ordonnance.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  DELETE PRESCRIPTION
// ----------------------------------------------------
exports.deletePrescription = async (req, res) => {
  try {
    // Must be logged in
    if (!req.user?.id) {
      return res.status(400).json({
        success: false,
        message: "Vous devez vous connecter.",
      });
    }

    // Find prescription
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Ordonnance non trouvée.",
      });
    }

    if (prescription.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    await Prescription.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ordonnance supprimée avec succès.",
    });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la suppression de l'ordonnance.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
// GET ALL MEDICINES //
// ----------------------------------------------------
exports.getAllMedicines = async (req, res) => {
  try {
    const searchQuery = req.query.q?.trim() || "";

    if (!searchQuery) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const query = {
      user_ref: req.user.id,
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { therapeuticClass: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const medicines = await Medicine.find(query).lean();

    res.status(200).json({
      success: true,
      data: medicines,
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
// GET ALL PATIENTS //
// ----------------------------------------------------
exports.getAllPatients = async (req, res) => {
  try {
    const searchQuery = req.query.q?.trim() || "";

    // If no search → return empty list
    if (!searchQuery) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Build search filter
    const query = {
      user_ref: req.user.id,
      $or: [
        { "personalInfo.firstName": { $regex: searchQuery, $options: "i" } },
        { "personalInfo.lastName": { $regex: searchQuery, $options: "i" } },
        { "personalInfo.email": { $regex: searchQuery, $options: "i" } },
        { "personalInfo.phone": { $regex: searchQuery, $options: "i" } },
      ],
    };

    // Fetch all matching patients (NO pagination, NO sorting)
    const patients = await Patient.find(query).lean();

    res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération des patients.",
      error: error.message,
    });
  }
};
