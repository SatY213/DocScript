import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {
  handleDelete,
  handleExpenseSubmit,
  handleExport,
  handleInvoiceSubmit,
} from ".";
import ConfirmDeletePopup from "../../common/deletePopup/ConfirmDeletePopup";
import AddEditInvoice from "./AddEditInvoice";
import AddEditExpense from "./AddEditExpense";

const Billing = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [expenseSearch, setExpenseSearch] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [deletePopup, setDeletePopup] = useState({ show: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [name, setName] = useState("invoices");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "supplies",
  });

  const navigate = useNavigate();
  const handleDeletePopup = (Id) => {
    setDeletePopup({ show: true, id: Id });
  };

  const {
    data: invoices = [],
    stats: invoiceStats,
    refetch: refetchInvoices,
  } = useFetch("/invoices", invoiceSearch, 1);
  const {
    data: expenses = [],
    stats: expenseStats,
    refetch: refetchExpenses,
  } = useFetch("/expenses", expenseSearch, 1);

  const refetch = () => {
    refetchInvoices();
    refetchExpenses();
  };

  // Handlers

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "DZD",
    }).format(amount);
  };

  return (
    <>
      {" "}
      {deletePopup.show && (
        <ConfirmDeletePopup
          itemName={`cette ${name === "invoices" ? "facture" : "dépense"}`}
          onConfirm={() =>
            handleDelete(
              deletePopup.id,
              setDeleteLoading,
              refetch,
              setDeletePopup,
              name
            )
          }
          onCancel={() => setDeletePopup({ show: false, id: null })}
          isProcessing={deleteLoading}
        />
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Facturation et Finances
          </h1>
          <p className="text-gray-600 ">
            Gérez vos factures, dépenses et suivez vos performances financières
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Revenu Total
              </h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(invoiceStats?.totalRevenue || 0)}
            </p>
            <p className="text-sm text-green-600 mt-1">
              {invoiceStats?.revenueGrowth || 0}% vs mois dernier
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Dépense Total
              </h3>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(expenseStats?.totalExpenses || 0)}
            </p>
            <p className="text-sm text-red-600 mt-1">
              {expenseStats?.expensesGrowth || 0}% vs mois dernier
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Bénéfice Net
              </h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <p
              className={`text-2xl font-bold ${
                invoiceStats?.totalRevenue - expenseStats?.totalExpenses >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(
                invoiceStats?.totalRevenue - expenseStats?.totalExpenses || 0
              )}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {(
                ((invoiceStats?.totalRevenue - expenseStats?.totalExpenses) /
                  (invoiceStats?.totalRevenue || 1)) *
                  100 || 0
              ).toFixed(1)}
              %
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">En Attente</h3>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(invoiceStats?.pendingAmount || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {invoices.filter((i) => i.status === "pending").length} factures
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddInvoice(true)}
              className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nouvelle Facture
            </button>

            <button
              onClick={() => setShowAddExpense(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajouter Dépense
            </button>

            <button
              onClick={() => handleExport("invoices", invoices)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Exporter Factures
            </button>

            <button
              onClick={() => handleExport("expenses", expenses)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Exporter Dépenses
            </button>
          </div>
        </div>

        {/* Tabs for Invoices and Expenses */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "revenue"
                  ? "border-[#54c2bc] text-[#54c2bc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dernières Factures
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "expenses"
                  ? "border-[#54c2bc] text-[#54c2bc]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dernières Dépenses
            </button>
          </nav>
        </div>

        {/* Invoices Table */}
        {activeTab === "revenue" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Factures Récentes
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {invoiceStats?.invoiceCount || 0} factures au total
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Rechercher une facture..."
                      value={invoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {invoices.length > 0 ? (
                <>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          N° Facture
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.slice(0, 10).map((invoice) => (
                        <tr
                          key={invoice._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.patient_ref?.personalInfo.firstName +
                              " " +
                              invoice.patient_ref?.personalInfo.lastName ||
                              "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(invoice.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                invoice.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : invoice.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {invoice.status === "paid"
                                ? "Payé"
                                : invoice.status === "pending"
                                ? "En attente"
                                : "Annulé"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                className="text-[#54c2bc] hover:text-[#3BAAA4] transition-colors"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                }}
                              >
                                Voir
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowAddInvoice(true);
                                }}
                              >
                                Éditer
                              </button>
                              <button
                                onClick={() => {
                                  setName("invoices");
                                  handleDeletePopup(invoice._id);
                                }}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>{" "}
                  <div className="px-6 py-4  rounded-b-xl bg-white  ">
                    <div className="flex items-center justify-between"></div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune facture trouvée</p>
                  <button
                    onClick={() => setShowAddInvoice(true)}
                    className="mt-4 px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm"
                  >
                    Créer votre première facture
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expenses Table */}
        {activeTab === "expenses" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Dépenses Récentes
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {expenseStats?.expenseCount || 0} dépenses au total
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Rechercher une dépense..."
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {expenses.length > 0 ? (
                <>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {expenses.slice(0, 10).map((expense) => {
                        return (
                          <tr
                            key={expense._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {expense.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {expense.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                              -{formatCurrency(expense.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(expense.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-gray-600 hover:text-gray-800 transition-colors"
                                  onClick={() => {
                                    setSelectedExpense(expense);
                                    setShowAddExpense(true);
                                  }}
                                >
                                  Éditer
                                </button>
                                <button
                                  onClick={() => {
                                    setName("expenses");
                                    handleDeletePopup(expense._id);
                                  }}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="px-6 py-4  rounded-b-xl bg-white  ">
                    <div className="flex items-center justify-between"></div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune dépense trouvée</p>
                  <button
                    onClick={() => setShowAddExpense(true)}
                    className="mt-4 px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm"
                  >
                    Ajouter votre première dépense
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Invoice Modal */}
        {showAddInvoice && (
          <AddEditInvoice
            setShowAddInvoice={setShowAddInvoice}
            refetchInvoices={refetchInvoices}
            handleInvoiceSubmit={handleInvoiceSubmit}
            selectedInvoice={selectedInvoice}
          />
        )}

        {/* Add Expense Modal */}
        {showAddExpense && (
          <AddEditExpense
            setShowAddExpense={setShowAddExpense}
            refetchExpenses={refetchExpenses}
            handleExpenseSubmit={handleExpenseSubmit}
            selectedExpense={selectedExpense}
          />
        )}
      </div>
    </>
  );
};

export default Billing;
