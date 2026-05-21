import { createEntity, deleteEntity, updateEntity } from "../../api/api";
import { showToast } from "../../common/common";

// Invoice Creation
export const handleInvoiceSubmit = async (
  setInvoiceSubmitLoading,
  setShowAddInvoice,
  formData,
  setFormData,
  refetchInvoices,
  id
) => {
  try {
    setInvoiceSubmitLoading(true);
    // API call to create invoice
    const response = id
      ? await updateEntity("invoices", id, formData)
      : await createEntity("invoices", formData);
    showToast(response.message, "success");
    if (id) {
      console.log("** Invoice updated **");
    } else {
      console.log("** Invoice created **");
    }
    setShowAddInvoice(false);
    setFormData({
      patient_ref: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      status: "paid",
    });
    refetchInvoices();
  } catch (error) {
    console.error("Invoice submit error", error);
    showToast(error.message, "error");
  } finally {
    setInvoiceSubmitLoading(false);
  }
};

// Expense Submit
export const handleExpenseSubmit = async (
  setExpenseSubmitLoading,
  setShowAddExpense,
  formData,
  setFormData,
  refetchExpenses,
  id
) => {
  try {
    setExpenseSubmitLoading(true);
    // API call to create expense
    const response = id
      ? await updateEntity("expenses", id, formData)
      : await createEntity("expenses", formData);
    showToast(response.message, "success");
    if (id) {
      console.log("** Expense updated **");
    } else {
      console.log("** Expense created **");
    }
    setShowAddExpense(false);
    setFormData({
      patient_ref: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      status: "paid",
    });
    refetchExpenses();
  } catch (error) {
    console.error("Expense submit error", error);
    showToast(error.message, "error");
  } finally {
    setExpenseSubmitLoading(false);
  }
};

// Export function
export const handleExport = (type, data) => {
  const headers =
    type === "invoices"
      ? ["ID", "Patient", "Description", "Montant", "Date", "Statut"]
      : ["ID", "Description", "Catégorie", "Montant", "Date"];

  const csvContent = [
    headers.join(","),
    ...data.map((item, index) => {
      if (type === "invoices") {
        return [
          item.invoiceNumber,
          item.patient_ref?.personalInfo.firstName +
            " " +
            item.patient_ref?.personalInfo.lastName || "N/A",
          item.description,
          item.amount,
          item.date,
          item.status,
        ].join(",");
      } else {
        return [
          index + 1,
          item.description,
          item.category,
          item.amount,
          item.date,
        ].join(",");
      }
    }),
  ].join("\n");

  const BOM = "\uFEFF";

  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
};

export const handleDelete = async (
  id,
  setLoading,
  fetchData,
  setDeletePopup,
  name
) => {
  try {
    setLoading(true);
    const response = await deleteEntity(name, id);
    showToast(response.message, "success");
    fetchData();
    console.log("** File deleted");
  } catch (error) {
    console.error("Error deleting file", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
    setDeletePopup({ show: false, id: null });
  }
};
