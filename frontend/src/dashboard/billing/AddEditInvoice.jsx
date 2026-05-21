import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";

function AddEditInvoice({
  setShowAddInvoice,
  refetchInvoices,
  handleInvoiceSubmit,
  selectedInvoice,
}) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [invoiceSubmitLoading, setInvoiceSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    patient_ref: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    status: "paid",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch data
  const { data: patients = [], loading: patientsLoading } = useFetch(
    "/patients",
    searchTerm,
    ""
  );

  // Initialize form with selectedInvoice data if editing
  useEffect(() => {
    if (selectedInvoice) {
      setSelectedPatient(selectedInvoice.patient_ref);

      setIsEditing(true);
      setFormData({
        patient_ref: selectedInvoice.patient_ref || "",
        amount: selectedInvoice.amount || "",
        description: selectedInvoice.description || "",
        date: selectedInvoice.date
          ? selectedInvoice.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: selectedInvoice.status || "paid",
      });

      // If selectedInvoice has patient data, set selectedPatient
      if (selectedInvoice.patient_ref) {
        // Fetch patient details or set from existing data
        // This assumes selectedInvoice might have patient info populated
        if (selectedInvoice.patientInfo) {
          setSelectedPatient({
            _id: selectedInvoice.patient_ref,
            personalInfo: selectedInvoice.patientInfo,
          });
          setSearchTerm(
            `${selectedInvoice.patientInfo.firstName} ${selectedInvoice.patientInfo.lastName}`
          );
        }
      }
    } else {
      setIsEditing(false);
    }
  }, [selectedInvoice]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({
      ...prev,
      patient_ref: patient._id,
      description:
        formData.description ||
        `Consultation ${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleInvoiceSubmit(
      setInvoiceSubmitLoading,
      setShowAddInvoice,
      formData,
      setFormData,
      refetchInvoices,

      selectedInvoice?._id
    );
  };

  const handleClose = () => {
    setShowAddInvoice(false);
    // Reset form data
    setFormData({
      patient_ref: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      status: "paid",
    });
    setSelectedPatient(null);
    setSearchTerm("");
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditing ? "Modifier la Facture" : "Nouvelle Facture"}
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
            {/* Patient Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                />
              </div>

              {searchTerm && patients.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-40 overflow-y-auto">
                  {patients.map((patient) => (
                    <div
                      key={patient._id}
                      onClick={() => {
                        handlePatientSelect(patient);
                        setSearchTerm("");
                      }}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm">
                        {patient.personalInfo.firstName}{" "}
                        {patient.personalInfo.lastName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(selectedPatient || formData.patient_ref) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  {selectedPatient
                    ? `Patient sélectionné: ${selectedPatient.personalInfo.firstName} ${selectedPatient.personalInfo.lastName}`
                    : "Patient sélectionné (ID: " + formData.patient_ref + ")"}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                placeholder="Description de la facture"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({
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
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              >
                <option value="paid">Payé</option>
                <option value="pending">En attente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({
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
              disabled={invoiceSubmitLoading}
              className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {invoiceSubmitLoading ? (
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
                  {isEditing ? "Modification..." : "Création..."}
                </span>
              ) : isEditing ? (
                "Modifier Facture"
              ) : (
                "Créer Facture"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditInvoice;
