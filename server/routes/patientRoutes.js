const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");

router.get(
  "/",
  // authenticate,
  patientController.getAllPatients
);
router.post(
  "/",
  // authenticate,
  patientController.createPatient
);
router.get(
  "/:id",
  // authenticate,
  patientController.getPatientById
);

router.patch(
  "/:id",
  // authenticate,
  patientController.updatePatient
);
router.delete(
  "/:id",
  // authenticate,
  patientController.deletePatient
);

module.exports = router;
