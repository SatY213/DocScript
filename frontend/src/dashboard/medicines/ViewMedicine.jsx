import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDocument } from ".";
import gelluleIcon from "../../utils/icons/gellule.svg";

const ViewMedicine = () => {
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDocument(id, setMedicine, setLoading);
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader animate-spin rounded-full h-12 w-12 border-4 border-[#54c2bc] border-t-transparent"></div>
      </div>
    );
  }

  if (!medicine) {
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
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
        <p className="text-gray-500">Médicament non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <img src={gelluleIcon} alt="" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {medicine.name}
              </h1>
              <p className="text-gray-600">
                {medicine.therapeuticClass} • {medicine.dosage}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate(`/dashboard/medicines/update/${id}`);
              }}
              className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium"
            >
              Modifier
            </button>
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/dashboard/medicines");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Retour
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="">
        {/* Informations Générales */}
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
              <h2 className="text-lg font-semibold text-gray-800">
                Informations Générales
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Nom du médicament" value={medicine.name} />
              <InfoField
                label="Classe thérapeutique"
                value={medicine.therapeuticClass}
              />
              <InfoField label="Dosage" value={medicine.dosage} />
              <InfoField label="Formes galéniques" value={medicine.shapes} />
            </div>

            {/* Notes et Précautions */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Notes et précautions
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[120px]">
                <p className="text-gray-900 text-sm whitespace-pre-line">
                  {medicine.note || "Aucune note spécifiée"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable component for simple info fields
const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <p className="text-gray-900 font-medium">{value || "-"}</p>
  </div>
);

export default ViewMedicine;
