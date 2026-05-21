const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");

router.get(
  "/",
  // authenticate,
  invoiceController.getAllInvoices
);
router.post(
  "/",
  // authenticate,
  invoiceController.createInvoice
);
router.get(
  "/:id",
  // authenticate,
  invoiceController.getInvoiceById
);

router.patch(
  "/:id",
  // authenticate,
  invoiceController.updateInvoice
);
router.delete(
  "/:id",
  // authenticate,
  invoiceController.deleteInvoice
);

module.exports = router;
