import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDocument, handlePrint, handleSubmit, validateForm } from ".";
import useFetch from "../../hooks/useFetch";

const CreateEditPrescription = ({ prescription = null, onSave }) => {
  const [formData, setFormData] = useState({
    patient_ref: prescription?.patient_ref || "",
    presribedMedicines: prescription?.presribedMedicines || [],
    note: prescription?.note || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  const [customMedicine, setCustomMedicine] = useState("");
  const [showCustomMedicine, setShowCustomMedicine] = useState(false);

  const { id } = useParams();
  const { patientId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      setFormData((prev) => ({ ...prev, patient_ref: patientId }));
    }
  }, [patientId]);
  useEffect(() => {
    if (id) {
      fetchDocument(id, setFormData, setSelectedPatient, setLoading);
    }
  }, [id]);
  // Fetch medicines based on search term
  const {
    data: medicines = [],
    error: medicineError,
    loading: medicinesLoading,
    refetch: refetchMedicines,
  } = useFetch("/medicines", medicineSearch, "");

  // Fetch patients based on search term
  const {
    data: patients = [],
    error: patientError,
    loading: patientsLoading,
    refetch: refetchPatients,
  } = useFetch("/patients", searchTerm, "");

  // Refetch when search terms change
  useEffect(() => {
    if (searchTerm) {
      refetchPatients();
    }
  }, [searchTerm, refetchPatients]);

  useEffect(() => {
    if (medicineSearch) {
      refetchMedicines();
    }
  }, [medicineSearch, refetchMedicines]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({ ...prev, patient_ref: patient._id }));
    setSearchTerm(``);
  };

  const handleMedicineSelect = (medicine) => {
    const medicineText = `${medicine.name} ${medicine.dosage} - ${medicine.shapes}`;

    // Check if medicine already exists in the list
    const exists = formData.presribedMedicines.some(
      (item) => item.medicine === medicineText,
    );

    if (!exists) {
      const newMedicine = {
        medicine: medicineText,
        instructions: "",
      };

      setFormData((prev) => ({
        ...prev,
        presribedMedicines: [...prev.presribedMedicines, newMedicine],
      }));
    }
    setMedicineSearch("");
  };

  const addCustomMedicine = () => {
    if (customMedicine.trim()) {
      // Check if custom medicine already exists
      const exists = formData.presribedMedicines.some(
        (item) => item.medicine === customMedicine.trim(),
      );

      if (!exists) {
        const newMedicine = {
          medicine: customMedicine.trim(),
          instructions: "",
        };

        setFormData((prev) => ({
          ...prev,
          presribedMedicines: [...prev.presribedMedicines, newMedicine],
        }));
        setCustomMedicine("");
        setShowCustomMedicine(false);
      }
    }
  };

  const removeMedicine = (index) => {
    setFormData((prev) => ({
      ...prev,
      presribedMedicines: prev.presribedMedicines.filter((_, i) => i !== index),
    }));
  };

  const updateMedicine = (index, field, value) => {
    setFormData((prev) => {
      const updatedMedicines = [...prev.presribedMedicines];
      updatedMedicines[index] = {
        ...updatedMedicines[index],
        [field]: value,
      };

      return {
        ...prev,
        presribedMedicines: updatedMedicines,
      };
    });
  };

  const moveMedicineUp = (index) => {
    if (index > 0) {
      setFormData((prev) => {
        const updatedMedicines = [...prev.presribedMedicines];
        const temp = updatedMedicines[index];
        updatedMedicines[index] = updatedMedicines[index - 1];
        updatedMedicines[index - 1] = temp;

        return {
          ...prev,
          presribedMedicines: updatedMedicines,
        };
      });
    }
  };

  const moveMedicineDown = (index) => {
    if (index < formData.presribedMedicines.length - 1) {
      setFormData((prev) => {
        const updatedMedicines = [...prev.presribedMedicines];
        const temp = updatedMedicines[index];
        updatedMedicines[index] = updatedMedicines[index + 1];
        updatedMedicines[index + 1] = temp;

        return {
          ...prev,
          presribedMedicines: updatedMedicines,
        };
      });
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isFormValid = () => {
    return formData.patient_ref && formData.presribedMedicines.length > 0;
  };

  const onCancel = () => {
    navigate("/dashboard/prescriptions");
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {id ? "Modifier l'Ordonnance" : "Nouvelle Ordonnance"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {id
            ? "Modifiez l'ordonnance du patient"
            : "Créez une nouvelle ordonnance médicale"}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          validateForm(formData, setErrors);
          handleSubmit(formData, setLoading, id, navigate);
        }}
        className="p-6"
      >
        <div className="space-y-8">
          {/* Sélection du Patient */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Sélection du Patient
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher un patient <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nom du patient..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  />
                  {patientsLoading && (
                    <div className="absolute right-3 top-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#54c2bc] border-t-transparent"></div>
                    </div>
                  )}
                </div>

                {searchTerm && patients.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                    {patients.map((patient) => (
                      <div
                        key={patient._id}
                        onClick={() => handlePatientSelect(patient)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">
                          {patient.personalInfo.firstName}{" "}
                          {patient.personalInfo.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {calculateAge(patient.personalInfo.birthDate)} ans •{" "}
                          {patient.personalInfo.sexe === "M"
                            ? "Homme"
                            : "Femme"}{" "}
                          • {patient.personalInfo.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchTerm && patients.length === 0 && !patientsLoading && (
                  <div className="mt-2 text-sm text-gray-500">
                    Aucun patient trouvé
                  </div>
                )}
              </div>

              {/* Patient Info Display */}
              {selectedPatient && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Patient sélectionné
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Nom:</span>{" "}
                      {selectedPatient.personalInfo.firstName}{" "}
                      {selectedPatient.personalInfo.lastName}
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Âge:</span>{" "}
                      {calculateAge(selectedPatient.personalInfo.birthDate)} ans
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Sexe:</span>{" "}
                      {selectedPatient.personalInfo.sexe === "M"
                        ? "Masculin"
                        : "Féminin"}
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">
                        Téléphone:
                      </span>{" "}
                      {selectedPatient.personalInfo.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Médicaments Prescrits */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Médicaments Prescrits <span className="text-red-600">*</span>
            </h3>

            <div className="space-y-4">
              {/* Search and Select Medicines */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher un médicament
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={medicineSearch}
                      onChange={(e) => setMedicineSearch(e.target.value)}
                      placeholder="Nom du médicament..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    />
                    {medicinesLoading && (
                      <div className="absolute right-3 top-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#54c2bc] border-t-transparent"></div>
                      </div>
                    )}
                    {medicineSearch && medicines.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {medicines.map((medicine) => (
                          <div
                            key={medicine._id}
                            onClick={() => handleMedicineSelect(medicine)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">
                              {medicine.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {medicine.dosage} • {medicine.shapes}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {medicineSearch &&
                      medicines.length === 0 &&
                      !medicinesLoading && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-500">
                          Aucun médicament trouvé
                        </div>
                      )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCustomMedicine(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Médicament personnalisé
                  </button>
                </div>
              </div>

              {/* Custom Medicine Input */}
              {showCustomMedicine && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-yellow-800 mb-2">
                    Ajouter un médicament personnalisé
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customMedicine}
                      onChange={(e) => setCustomMedicine(e.target.value)}
                      placeholder="Ex: Paracétamol 500mg, 1 comprimé 3x/jour..."
                      className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={addCustomMedicine}
                      className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium"
                    >
                      Ajouter
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomMedicine(false);
                        setCustomMedicine("");
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Liste des Médicaments */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Médicaments prescrits ({formData.presribedMedicines.length})
                  </label>
                  {formData.presribedMedicines.length > 0 && (
                    <span className="text-xs text-gray-500">
                      Cliquez pour éditer, glissez pour réorganiser
                    </span>
                  )}
                </div>
                {formData.presribedMedicines.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Aucun médicament ajouté</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.presribedMedicines.map((medicineItem, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="space-y-3">
                          {/* Medicine Header with Reordering Controls */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                              Médicament {index + 1}
                            </span>
                            <div className="flex space-x-1">
                              <button
                                type="button"
                                onClick={() => moveMedicineUp(index)}
                                disabled={index === 0}
                                className={`p-1 rounded ${
                                  index === 0
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-200"
                                }`}
                                title="Déplacer vers le haut"
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
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => moveMedicineDown(index)}
                                disabled={
                                  index ===
                                  formData.presribedMedicines.length - 1
                                }
                                className={`p-1 rounded ${
                                  index ===
                                  formData.presribedMedicines.length - 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-200"
                                }`}
                                title="Déplacer vers le bas"
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
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Medicine Name - Editable */}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Nom du médicament
                            </label>
                            <input
                              type="text"
                              value={medicineItem.medicine}
                              onChange={(e) =>
                                updateMedicine(
                                  index,
                                  "medicine",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm bg-white"
                              placeholder="Nom du médicament..."
                            />
                          </div>

                          {/* Personalized Instructions - Editable */}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Instructions personnalisées
                            </label>
                            <input
                              type="text"
                              value={medicineItem.instructions || ""}
                              onChange={(e) =>
                                updateMedicine(
                                  index,
                                  "instructions",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm bg-white"
                              placeholder="Ex: 1 comprimé 3x/jour après les repas pendant 7 jours..."
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="flex justify-end pt-2 border-t border-gray-200">
                            <button
                              type="button"
                              onClick={() => removeMedicine(index)}
                              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Supprimer ce médicament
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Notes et Instructions
            </h3>

            <div>
              <textarea
                name="note"
                value={formData.note}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                placeholder="Instructions supplémentaires, précautions, durée du traitement..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-200">
          <button
            type="button"
            disabled={!isFormValid() || loading}
            onClick={() => handlePrint(formData, selectedPatient, null)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Imprimer
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {id ? "Modifier l'Ordonnance" : "Créer l'Ordonnance"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPrescription;
