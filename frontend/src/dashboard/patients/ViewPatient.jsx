import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDocument } from ".";

const ViewPatient = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDocument(id, setPatient, setLoading);
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
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getStatusBadge = (statut) => {
    const statusStyles = {
      Active: "bg-green-100 text-green-800",
      Terminée: "bg-gray-100 text-gray-800",
      "En attente": "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[statut]}`}
      >
        {statut}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader animate-spin rounded-full h-12 w-12 border-4 border-[#54c2bc] border-t-transparent"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Patient non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#54c2bc] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {patient.personalInfo.firstName[0]}
                {patient.personalInfo.lastName[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {patient.personalInfo.firstName} {patient.personalInfo.lastName}
              </h1>
              <p className="text-gray-600">
                {calculateAge(patient.personalInfo.birthDate)} ans •{" "}
                {patient.personalInfo.sexe === "M" ? "Homme" : "Femme"} •{" "}
                {patient.personalInfo.profession}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/dashboard/ordonnances/create/${id}`)}
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
              Nouvelle ordonnance
            </button>
            <button
              onClick={() => navigate(`/dashboard/patients/update/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Modifier
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Informations Personnelles */}
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
                Informations Personnelles
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <InfoField
              label="Nom complet"
              value={`${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`}
            />
            <InfoField
              label="Date de naissance"
              value={formatDate(patient.personalInfo.birthDate)}
            />
            <InfoField
              label="Âge"
              value={`${calculateAge(patient.personalInfo.birthDate)} ans`}
            />
            <InfoField
              label="Sexe"
              value={patient.personalInfo.sexe === "M" ? "Masculin" : "Féminin"}
            />
            <InfoField
              label="État civil"
              value={patient.personalInfo.civilState}
            />
            <InfoField
              label="Profession"
              value={patient.personalInfo.profession}
            />
            <InfoField
              label="Employeur"
              value={patient.personalInfo.employer}
            />
          </div>
        </div>

        {/* Coordonnées */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden ">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">Coordonnées</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <InfoField label="Téléphone" value={patient.personalInfo.phone} />
            <InfoField label="Email" value={patient.personalInfo.email} />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Adresse
              </label>
              <p className="text-gray-900">
                {patient.personalInfo.address || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Contact d'urgence */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden ">
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
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">
                Contact d'urgence
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <InfoField label="Nom" value={patient.emergencyContact.fullName} />
            <InfoField
              label="Lien de parenté"
              value={patient.emergencyContact.relationship}
            />
            <InfoField
              label="Téléphone"
              value={patient.emergencyContact.phone}
            />
          </div>
        </div>

        {/* Informations Médicales */}
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
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">
                Informations Médicales
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoField
                  label="Groupe sanguin"
                  value={patient.medicalInfo.bloodGroup}
                />
                <InfoField
                  label="Poids"
                  value={
                    patient.medicalInfo.weight
                      ? `${patient.medicalInfo.weight} kg`
                      : "-"
                  }
                />
                <InfoField
                  label="Taille"
                  value={
                    patient.medicalInfo.height
                      ? `${patient.medicalInfo.height} cm`
                      : "-"
                  }
                />
                <InfoField
                  label="Périmètre cranien"
                  value={
                    patient.medicalInfo.CranialPerimeter
                      ? `${patient.medicalInfo.CranialPerimeter} cm`
                      : "-"
                  }
                />
              </div>
              <div className="space-y-4">
                <TextAreaField
                  label="Antécédents médicaux"
                  value={patient.medicalInfo.medicalHistory}
                />
                <TextAreaField
                  label="Allergies médicamenteuses"
                  value={patient.medicalInfo.drugAllergies}
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextAreaField
                label="Maladies chroniques"
                value={patient.medicalInfo.chronicIllnesses}
              />
              <TextAreaField
                label="Suivi médical"
                value={patient.medicalInfo.medicalFollowUp}
              />
            </div>
          </div>
        </div>

        {/* Informations Administratives */}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">
                Informations Administratives
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <InfoField
              label="Numéro de sécurité sociale"
              value={patient.personalInfo.socialSecutiryNumber}
            />
            <InfoField
              label="Numéro de carte CHIFA"
              value={patient.personalInfo.chifaCardNumber}
            />
            <InfoField
              label="Date de création"
              value={formatDate(patient.createdAt)}
            />
          </div>
        </div>

        {/* Liste des Ordonnances */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-3">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-lg font-bold text-gray-800">
                  Liste des Ordonnances
                </h2>
              </div>
              <button
                onClick={() => navigate(`/dashboard/ordonnances/create/${id}`)}
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
                Nouvelle ordonnance
              </button>
            </div>
          </div>
          <div className="p-6">
            {patient.prescriptions && patient.prescriptions.length > 0 ? (
              <div className="space-y-4">
                {patient.prescriptions.map((prescription) => {
                  const medicinesWithInstructions =
                    prescription.presribedMedicines?.filter(
                      (item) => item.instructions && item.instructions.trim()
                    ).length || 0;

                  const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return date.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
                  };

                  return (
                    <div
                      key={prescription._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-900 font-medium">
                            Ordonnance du {formatDate(prescription.createdAt)}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {prescription.presribedMedicines?.length || 0}{" "}
                            médicament(s)
                          </span>
                          {medicinesWithInstructions > 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {medicinesWithInstructions} avec instructions
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/prescriptions/view/${prescription._id}`
                              )
                            }
                            className="text-[#54c2bc] hover:text-[#3BAAA4] transition-colors text-sm font-medium"
                          >
                            Voir
                          </button>
                          <button
                            onClick={() =>
                              handlePrintPrescription(prescription, patient)
                            }
                            className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
                          >
                            PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 mb-3">
                  Aucune ordonnance pour ce patient
                </p>
                <button
                  onClick={() =>
                    navigate(`/dashboard/ordonnances/create/${id}`)
                  }
                  className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium"
                >
                  Créer la première ordonnance
                </button>
              </div>
            )}
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

// Reusable component for text area fields
const TextAreaField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[60px]">
      <p className="text-gray-900 text-sm whitespace-pre-line">
        {value || "Aucune information"}
      </p>
    </div>
  </div>
);

export default ViewPatient;
