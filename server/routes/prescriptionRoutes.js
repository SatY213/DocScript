const express = require("express");
const router = express.Router();

const prescriptionController = require("../controllers/prescriptionController");

router.get(
  "/",
  // authenticate,
  prescriptionController.getAllPrescriptions
);
router.get(
  "/medicines",
  // authenticate,
  prescriptionController.getAllMedicines
);
router.get(
  "/patients",
  // authenticate,
  prescriptionController.getAllMedicines
);
router.post(
  "/",
  // authenticate,
  prescriptionController.createPrescription
);
router.get(
  "/:id",
  // authenticate,
  prescriptionController.getPrescriptionById
);

router.patch(
  "/:id",
  // authenticate,
  prescriptionController.updatePrescription
);
router.delete(
  "/:id",
  // authenticate,
  prescriptionController.deletePrescription
);

module.exports = router;
