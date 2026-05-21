const express = require("express");
const router = express.Router();

const medicineController = require("../controllers/medicineController");

router.get(
  "/",
  // authenticate,
  medicineController.getAllMedicines
);
router.post(
  "/",
  // authenticate,
  medicineController.createMedicine
);
router.get(
  "/:id",
  // authenticate,
  medicineController.getMedicineById
);

router.patch(
  "/:id",
  // authenticate,
  medicineController.updateMedicine
);
router.delete(
  "/:id",
  // authenticate,
  medicineController.deleteMedicine
);

module.exports = router;
