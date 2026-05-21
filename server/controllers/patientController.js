const Patient = require("../models/patient");
const Prescription = require("../models/prescription");
const { escapeRegex } = require("../utils/functions");

// ----------------------------------------------------
//  GET ALL PATIENTS
// ----------------------------------------------------

exports.getAllPatients = async (req, res) => {
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

    const query = { user_ref: req.user.id };

    if (searchQuery) {
      const safeRegex = new RegExp(escapeRegex(searchQuery), "i");

      query.$or = [
        // individual fields
        { "personalInfo.firstName": safeRegex },
        { "personalInfo.lastName": safeRegex },
        { "personalInfo.email": safeRegex },
        { "personalInfo.phone": safeRegex },

        //  combined firstName + lastName
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: [
                  "$personalInfo.firstName",
                  " ",
                  "$personalInfo.lastName",
                ],
              },
              regex: safeRegex,
            },
          },
        },
      ];
    }

    const sortObj = {};
    if (sortBirthDate !== undefined)
      sortObj["personalInfo.birthDate"] = sortBirthDate;
    if (sortLastName !== undefined)
      sortObj["personalInfo.lastName"] = sortLastName;
    sortObj["createdAt"] = -1;

    const [totalCount, patients] = await Promise.all([
      Patient.countDocuments(query),

      Patient.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort(sortObj)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: patients,
      stats: { total: totalCount },
      pagination: {
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        totalItems: patients.length,
      },
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

// ----------------------------------------------------
//  CREATE PATIENT
// ----------------------------------------------------
exports.createPatient = async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Vous devez vous connecter.",
      });
    }
    req.body.user_ref = req.user.id;
    const newPatient = new Patient(req.body);

    const saved = await newPatient.save();

    res.status(201).json({
      success: true,
      message: "Patient créé avec succes.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la création du patient.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  GET PATIENT BY ID
// ----------------------------------------------------
exports.getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;

    const patient = await Patient.findById(patientId).lean();
    if (!req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Vous devez vous connecter.",
      });
    }
    if (patient.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient non trouvée.",
      });
    }

    const prescriptions = await Prescription.find({
      patient_ref: patientId,
    })
      .sort({ createdAt: -1 })
      .lean();

    patient.prescriptions = prescriptions;

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération du patient.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  UPDATE PATIENT
// ----------------------------------------------------
exports.updatePatient = async (req, res) => {
  try {
    // Get patient from DB
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient introuvable.",
      });
    }

    // Check owner
    if (patient.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    // Update patient
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Patient mis à jour avec succès.",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({
      success: false,
      message: "Échec de la mise à jour du patient.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  DELETE PATIENT
// ----------------------------------------------------
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient introuvable.",
      });
    }

    if (patient.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Patient supprimé avec succès.",
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({
      success: false,
      message: "Échec de la suppression du patient.",
      error: error.message,
    });
  }
};
