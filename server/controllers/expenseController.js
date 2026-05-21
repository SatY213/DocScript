const Expense = require("../models/expense");

// ----------------------------------------------------
//  GET ALL EXPENSES
// ----------------------------------------------------

exports.getAllExpenses = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.q?.trim() || "";

    const query = { user_ref: req.user.id };

    if (searchQuery) {
      query.$or = [
        { description: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // ---------- PAGINATION + FETCH ----------
    const [totalCount, expenses] = await Promise.all([
      Expense.countDocuments(query),

      Expense.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ date: -1, createdAt: -1 })
        .lean(),
    ]);

    // ---------- GLOBAL STATS ----------
    const allExpenses = await Expense.find({ user_ref: req.user.id }).lean();

    const totalExpenses = allExpenses.reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0
    );

    // Month over month growth
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    const expensesThisMonth = allExpenses
      .filter((exp) => new Date(exp.date).getMonth() === now.getMonth())
      .reduce((s, e) => s + e.amount, 0);

    const expensesLastMonth = allExpenses
      .filter((exp) => new Date(exp.date).getMonth() === lastMonth.getMonth())
      .reduce((s, e) => s + e.amount, 0);

    const expensesGrowth =
      expensesLastMonth > 0
        ? (
            ((expensesThisMonth - expensesLastMonth) / expensesLastMonth) *
            100
          ).toFixed(1)
        : 0;

    const stats = {
      totalExpenses,
      expensesGrowth,
      expenseCount: allExpenses.length,
    };

    return res.status(200).json({
      success: true,
      data: expenses,
      stats,
      pagination: {
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        totalItems: expenses.length,
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des dépenses.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  CREATE EXPENSE
// ----------------------------------------------------

exports.createExpense = async (req, res) => {
  try {
    req.body.user_ref = req.user.id;
    const newExpense = new Expense(req.body);
    const saved = await newExpense.save();

    res.status(201).json({
      success: true,
      message: "Dépense créée avec succès.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la création de la dépense.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  GET EXPENSE BY ID
// ----------------------------------------------------

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Dépense non trouvée." });
    }
    if (expense.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération de la dépense.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  UPDATE EXPENSE
// ----------------------------------------------------

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Dépense non trouvée." });
    }

    if (expense.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Dépense mise à jour avec succès.",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la mise à jour de la dépense.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  DELETE EXPENSE
// ----------------------------------------------------

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Dépense non trouvée." });
    }

    if (expense.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Dépense supprimée avec succès.",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la suppression de la dépense.",
      error: error.message,
    });
  }
};
