const Invoice = require("../models/invoice");

// ----------------------------------------------------
//  GET ALL INVOICES
// ----------------------------------------------------

exports.getAllInvoices = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.q?.trim() || "";

    const query = { user_ref: req.user.id };

    if (searchQuery) {
      query.$or = [
        { invoiceNumber: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // ---------- PAGINATION + FETCH ----------
    const [totalCount, invoices] = await Promise.all([
      Invoice.countDocuments(query),

      Invoice.find(query)
        .populate("patient_ref", "personalInfo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ date: -1, createdAt: -1 })
        .lean(),
    ]);

    // ---------- STATISTICS ----------
    const allInvoices = await Invoice.find({ user_ref: req.user.id }).lean();

    const totalRevenue = allInvoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const pendingAmount = allInvoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    // Month over month growth (example)
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    const revenueThisMonth = allInvoices
      .filter(
        (inv) =>
          inv.status === "paid" &&
          new Date(inv.date).getMonth() === now.getMonth()
      )
      .reduce((s, i) => s + i.amount, 0);

    const revenueLastMonth = allInvoices
      .filter(
        (inv) =>
          inv.status === "paid" &&
          new Date(inv.date).getMonth() === lastMonth.getMonth()
      )
      .reduce((s, i) => s + i.amount, 0);

    const revenueGrowth =
      revenueLastMonth > 0
        ? (
            ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) *
            100
          ).toFixed(1)
        : 0;

    const stats = {
      totalRevenue,
      pendingAmount,
      revenueGrowth: revenueGrowth,
      invoiceCount: allInvoices.length,
    };

    return res.status(200).json({
      success: true,
      data: invoices,
      stats,
      pagination: {
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        totalItems: invoices.length,
      },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des invoices.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  CREATE INVOICE
// ----------------------------------------------------
exports.createInvoice = async (req, res) => {
  try {
    req.body.user_ref = req.user.id;
    const newInvoice = new Invoice(req.body);

    const saved = await newInvoice.save();

    res.status(201).json({
      success: true,
      message: "Facture créé avec succes.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la création de la facture.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  GET INVOICE BY ID
// ----------------------------------------------------
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Facture non trouvée." });
    }
    if (invoice.user_ref.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé." });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la récupération de la facture.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  UPDATE INVOICE
// ----------------------------------------------------
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Facture non trouvée." });
    }

    if (invoice.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Facture mise à jour avec succès.",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la mise à jour de la facture.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  DELETE INVOICE
// ----------------------------------------------------
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Facture non trouvée." });
    }

    if (invoice.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Facture supprimée avec succès.",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({
      success: false,
      message: "Echec de la suppression de la facture.",
      error: error.message,
    });
  }
};
