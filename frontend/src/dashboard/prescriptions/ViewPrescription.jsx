import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDocument, handlePrint } from ".";
import gelluleIcon from "../../utils/icons/gellule.svg";

const ViewPrescription = () => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDocument(id, setPrescription, setSelectedPatient, setLoading);
    }
  }, [id]);

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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader animate-spin rounded-full h-12 w-12 border-4 border-[#54c2bc] border-t-transparent"></div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-500">Ordonnance non trouvée</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Ordonnance Médicale
            </h1>
            <p className="text-gray-600 mt-1">
              Prescrite le {formatDate(prescription.createdAt)}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/dashboard/prescriptions/update/${id}`)}
              className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={() => handlePrint(prescription, selectedPatient, null)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center "
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
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Retour
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations Patient */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-[#54c2bc]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">
                Informations Patient
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-[#54c2bc] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {prescription.patient_ref.personalInfo.firstName[0]}
                  {prescription.patient_ref.personalInfo.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {prescription.patient_ref.personalInfo.firstName}{" "}
                  {prescription.patient_ref.personalInfo.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  {calculateAge(
                    prescription.patient_ref.personalInfo.birthDate
                  )}{" "}
                  ans •{" "}
                  {prescription.patient_ref.personalInfo.sexe === "M"
                    ? "Homme"
                    : "Femme"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Date de naissance"
                value={formatDate(
                  prescription.patient_ref.personalInfo.birthDate
                )}
              />
              <InfoField
                label="Âge"
                value={`${calculateAge(
                  prescription.patient_ref.personalInfo.birthDate
                )} ans`}
              />
              <InfoField
                label="Téléphone"
                value={prescription.patient_ref.personalInfo.phone}
              />
              <InfoField
                label="Email"
                value={prescription.patient_ref.personalInfo.email}
              />
              <InfoField
                label="État civil"
                value={prescription.patient_ref.personalInfo.civilState}
              />
              <InfoField
                label="Profession"
                value={prescription.patient_ref.personalInfo.profession}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <InfoField
                label="Adresse"
                value={prescription.patient_ref.personalInfo.address}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Médicaments Prescrits */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img
                src={gelluleIcon}
                alt=""
                className="w-5 h-5 text-[#54c2bc]"
              />
              <h2 className="text-lg font-bold text-gray-800">
                Médicaments Prescrits
              </h2>
            </div>
          </div>
          <div className="p-6">
            {prescription.presribedMedicines.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun médicament prescrit</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescription.presribedMedicines.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-blue-600 text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        {/* Medicine Name */}
                        <p className="text-gray-900 font-medium">
                          {item.medicine}
                        </p>

                        {/* Instructions (if exists) */}
                        {item.instructions && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">Instructions:</span>{" "}
                              {item.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes et Instructions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-[#54c2bc]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">
                Notes et Instructions
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-line">
                {prescription.note || "Aucune note spécifiée"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable component for simple info fields
const InfoField = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <p className="text-gray-900 font-medium">{value || "-"}</p>
  </div>
);

export default ViewPrescription;
