const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseController");

router.get(
  "/",
  // authenticate,
  expenseController.getAllExpenses
);
router.post(
  "/",
  // authenticate,
  expenseController.createExpense
);
router.get(
  "/:id",
  // authenticate,
  expenseController.getExpenseById
);

router.patch(
  "/:id",
  // authenticate,
  expenseController.updateExpense
);
router.delete(
  "/:id",
  // authenticate,
  expenseController.deleteExpense
);

module.exports = router;
