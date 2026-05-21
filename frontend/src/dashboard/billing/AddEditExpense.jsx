import React, { useState, useEffect } from "react";

function AddEditExpense({
  setShowAddExpense,
  refetchExpenses,
  handleExpenseSubmit,
  selectedExpense,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [expenseSubmitLoading, setExpenseSubmitLoading] = useState(false);

  // Initialize form with selectedExpense data if editing
  useEffect(() => {
    if (selectedExpense) {
      setIsEditing(true);
      setExpenseForm({
        description: selectedExpense.description || "",
        category: selectedExpense.category || "other",
        amount: selectedExpense.amount || "",
        date: selectedExpense.date
          ? selectedExpense.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      setIsEditing(false);
    }
  }, [selectedExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleExpenseSubmit(
      setExpenseSubmitLoading,
      setShowAddExpense,
      expenseForm,
      setExpenseForm,
      refetchExpenses,
      selectedExpense?._id
    );
  };

  const handleClose = () => {
    setShowAddExpense(false);
    // Reset form
    setExpenseForm({
      description: "",
      category: "other",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditing ? "Modifier la Dépense" : "Nouvelle Dépense"}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                placeholder="Description de la dépense"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <input
                type="text"
                name="category"
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                placeholder="Catégorie de la dépense"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant
              </label>
              <input
                type="number"
                name="amount"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de la dépense
              </label>
              <input
                type="date"
                name="date"
                value={expenseForm.date}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={expenseSubmitLoading}
              className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {expenseSubmitLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isEditing ? "Modification..." : "Ajout..."}
                </span>
              ) : isEditing ? (
                "Modifier Dépense"
              ) : (
                "Ajouter Dépense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditExpense;
