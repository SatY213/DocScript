// Certificates.js - Refactored with formData (no editing)
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { calculateAge } from "../prescriptions";
import buildCertificate from "./components/build-certificate";
import { getBodies } from "./bodies";

export default function Certificates() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Single formData object instead of multiple states
  const [formData, setFormData] = useState({
    selectedCert: "arret",
    startDate: "",
    endDate: "",
    days: 1,
    reason: "",
    // Certificate-specific details
    pregnancyWeeks: 1,
    followUpReason: "",
    disabilityRate: "",
    deathReason: "",
    contagiousDisease: "",
    vaccineName: "",
    vaccineDate: "",
    chronicDisease: "",
    schoolYear: "",
    marriageDate: "",
    certificateReason: "",
  });

  const certTypes = [
    { key: "arret", label: "Arrêt de Travail" },
    { key: "bonne", label: "Bonne Santé" },
    { key: "presence", label: "Présence" },
    { key: "suivi", label: "Suivi Médical" },
    { key: "grossesse", label: "Grossesse" },
    { key: "invalidite", label: "Invalidité" },
    { key: "deces", label: "Décès" },
    { key: "noncontagion", label: "Non-Contagion" },
    { key: "prenuptial", label: "Prénuptial" },
    { key: "scolaire", label: "Scolaire" },
    { key: "chronique", label: "Maladie Chronique" },
    { key: "vaccination", label: "Vaccination" },
  ];

  // Helper function to update form data
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm("");
  };

  // Calculate end date when start date or days change
  useEffect(() => {
    if (formData.selectedCert === "arret" && formData.startDate) {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + formData.days);
      updateFormData("endDate", end.toISOString().split("T")[0]);
    }
  }, [formData.startDate, formData.days, formData.selectedCert]);

  // Get current bodies with updated parameters
  const getCurrentBodies = () => {
    const patientName = selectedPatient
      ? `${selectedPatient.personalInfo?.firstName || ""} ${selectedPatient.personalInfo?.lastName || ""}`.trim()
      : "John Doe";

    return getBodies({
      pregnancyWeeks: formData.pregnancyWeeks,
      followUpReason: formData.followUpReason,
      disabilityRate: formData.disabilityRate,
      deathDate: new Date().toLocaleDateString("fr-FR"),
      deathReason: formData.deathReason,
      contagiousDisease: formData.contagiousDisease,
      vaccineName: formData.vaccineName,
      vaccineDate: formData.vaccineDate
        ? new Date(formData.vaccineDate).toLocaleDateString("fr-FR")
        : "",
      chronicDisease: formData.chronicDisease,
      schoolYear: formData.schoolYear,
      marriageDate: formData.marriageDate
        ? new Date(formData.marriageDate).toLocaleDateString("fr-FR")
        : "",
      startDate: formData.startDate
        ? new Date(formData.startDate).toLocaleDateString("fr-FR")
        : "",
      endDate: formData.endDate
        ? new Date(formData.endDate).toLocaleDateString("fr-FR")
        : "",
      reason: formData.reason || formData.certificateReason,
      selectedPatient: patientName,
      doctorName: "Abdelhakim Merini",
      specialty: "Cardiologue",
      days: formData.days,
      patientInfo: selectedPatient || {},
    });
  };

  // Fetch patients based on search term
  const {
    data: patients = [],
    error: patientError,
    loading: patientsLoading,
  } = useFetch("/patients", searchTerm, "");

  const getCertificatePreview = () => {
    const today = new Date().toLocaleDateString("fr-FR");

    const doctorInfoHTML = `
      <div style="padding: 10px; margin-bottom: 30px; display: inline-block;">
        <div style="font-size: 13px;">
          <p style="margin: 0; font-weight: bold;">Abdelhakim Merini</p>
          <p style="margin: 0;">Cardiologue</p>
          <p style="margin: 0;">Birouana nord n°16</p>
          <p style="margin: 0;">Tél: +213 542 09 18 97</p>
        </div>
      </div>
    `;

    const cert = certTypes.find((c) => c.key === formData.selectedCert);
    const bodies = getCurrentBodies();

    const titles = {
      arret: "CERTIFICAT MÉDICAL D'ARRÊT DE TRAVAIL",
      bonne: "CERTIFICAT DE BONNE SANTÉ",
      presence: "CERTIFICAT DE PRÉSENCE",
      suivi: "CERTIFICAT DE SUIVI MÉDICAL",
      grossesse: "CERTIFICAT DE GROSSESSE",
      invalidite: "CERTIFICAT D'INVALIDITÉ",
      deces: "CERTIFICAT DE DÉCÈS",
      noncontagion: "CERTIFICAT DE NON-CONTAGION",
      prenuptial: "CERTIFICAT PRÉNUPTIAL",
      scolaire: "CERTIFICAT MÉDICAL SCOLAIRE",
      chronique: "CERTIFICAT DE MALADIE CHRONIQUE",
      vaccination: "CERTIFICAT DE VACCINATION",
    };

    const body =
      bodies[formData.selectedCert] ||
      `
      <p style="margin-bottom: 15px; color: #666;">
        Modèle de certificat "${cert?.label || formData.selectedCert}"
      </p>
      <p style="margin-bottom: 15px; color: #666;">
        Veuillez personnaliser le contenu selon les besoins spécifiques.
      </p>
    `;

    return buildCertificate({
      title: titles[formData.selectedCert] || "CERTIFICAT MÉDICAL",
      body,
      doctorInfoHTML,
      today,
    });
  };

  const handlePrint = () => {
    const content = getCertificatePreview();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificat Médical</title>
          <style>
            @media print {
              @page { margin: 20mm; }
              body { font-family: 'Times New Roman', Times, serif; padding: 40px; }
            }
            body { font-family: 'Times New Roman', Times, serif; padding: 40px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  // Render conditional fields based on certificate type
  const renderCertificateSpecificFields = () => {
    switch (formData.selectedCert) {
      case "grossesse":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semaines de grossesse
            </label>
            <input
              type="number"
              value={formData.pregnancyWeeks || ""}
              onChange={(e) =>
                updateFormData("pregnancyWeeks", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              min="1"
              max="42"
            />
          </div>
        );

      case "suivi":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif du suivi
            </label>
            <input
              type="text"
              value={formData.followUpReason}
              onChange={(e) => updateFormData("followUpReason", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Ex: Suivi cardiologique"
            />
          </div>
        );

      case "invalidite":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux d'invalidité (%)
            </label>
            <input
              type="text"
              value={formData.disabilityRate}
              onChange={(e) => updateFormData("disabilityRate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Ex: 60%"
            />
          </div>
        );

      case "deces":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cause du décès
            </label>
            <input
              type="text"
              value={formData.deathReason}
              onChange={(e) => updateFormData("deathReason", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Ex: Cause naturelle"
            />
          </div>
        );

      case "noncontagion":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maladie contagieuse à exclure
            </label>
            <input
              type="text"
              value={formData.contagiousDisease}
              onChange={(e) =>
                updateFormData("contagiousDisease", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Ex: Tuberculose"
            />
          </div>
        );

      case "vaccination":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du vaccin
              </label>
              <input
                type="text"
                value={formData.vaccineName}
                onChange={(e) => updateFormData("vaccineName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                placeholder="Ex: COVID-19"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de vaccination
              </label>
              <input
                type="date"
                value={formData.vaccineDate}
                onChange={(e) => updateFormData("vaccineDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              />
            </div>
          </>
        );

      case "chronique":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maladie chronique
            </label>
            <input
              type="text"
              value={formData.chronicDisease}
              onChange={(e) => updateFormData("chronicDisease", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Ex: Hypertension artérielle"
            />
          </div>
        );

      case "scolaire":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année scolaire
            </label>
            <input
              type="text"
              value={formData.schoolYear}
              onChange={(e) => updateFormData("schoolYear", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Ex: 2025/2026"
            />
          </div>
        );

      case "prenuptial":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date du mariage
            </label>
            <input
              type="date"
              value={formData.marriageDate}
              onChange={(e) => updateFormData("marriageDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Certificats Médicaux
        </h1>
        <p className="text-gray-600">
          Générez et personnalisez des certificats médicaux professionnels
        </p>
      </div>

      {/* Two Columns Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Form (50%) */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Patient Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <span className="text-[#54c2bc] mr-2">1.</span>
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
                          {patient.personalInfo?.firstName}{" "}
                          {patient.personalInfo?.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {calculateAge(patient.personalInfo?.birthDate)} ans •{" "}
                          {patient.personalInfo?.sexe === "M"
                            ? "Homme"
                            : "Femme"}{" "}
                          • {patient.personalInfo?.phone}
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
                      {selectedPatient.personalInfo?.firstName}{" "}
                      {selectedPatient.personalInfo?.lastName}
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Âge:</span>{" "}
                      {calculateAge(selectedPatient.personalInfo?.birthDate)}{" "}
                      ans
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Sexe:</span>{" "}
                      {selectedPatient.personalInfo?.sexe === "M"
                        ? "Masculin"
                        : "Féminin"}
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">
                        Téléphone:
                      </span>{" "}
                      {selectedPatient.personalInfo?.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certificate Type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <span className="text-[#54c2bc] mr-2">2.</span>
              Type de Certificat
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {certTypes.map((cert) => (
                <button
                  key={cert.key}
                  onClick={() => {
                    updateFormData("selectedCert", cert.key);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.selectedCert === cert.key
                      ? "bg-[#54c2bc] text-white border-[#54c2bc]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {cert.label}
                </button>
              ))}
            </div>
          </div>

          {/* Certificate Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <span className="text-[#54c2bc] mr-2">3.</span>
              Détails du Certificat
            </h3>

            <div className="space-y-4">
              {/* Certificate-specific fields */}
              {renderCertificateSpecificFields()}

              {/* Date fields for certificates that need them */}
              {(formData.selectedCert === "arret" ||
                formData.selectedCert === "presence") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        updateFormData("startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    />
                  </div>

                  {formData.selectedCert === "arret" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de jours
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={formData.days}
                          placeholder="Nombre de jour"
                          onChange={(e) => {
                            const newDays = parseInt(e.target.value) || 1;
                            updateFormData("days", newDays);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Calculée automatiquement
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Reason field */}
              {(formData.selectedCert === "arret" ||
                formData.selectedCert === "invalidite" ||
                formData.selectedCert === "chronique") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motif
                  </label>
                  <textarea
                    value={
                      formData.selectedCert === "arret"
                        ? formData.reason
                        : formData.certificateReason
                    }
                    onChange={(e) => {
                      if (formData.selectedCert === "arret") {
                        updateFormData("reason", e.target.value);
                      } else {
                        updateFormData("certificateReason", e.target.value);
                      }
                    }}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    placeholder="Décrivez le motif médical..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Preview (50%) */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Preview Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Aperçu du certificat
              </h3>
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium flex items-center"
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
            </div>

            {/* Certificate Preview Content - THIS WAS MISSING */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 min-h-[600px] overflow-auto">
              <div className="bg-white p-8 min-h-[550px]">
                <div
                  dangerouslySetInnerHTML={{ __html: getCertificatePreview() }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrint}
                className="w-full py-3 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors font-medium text-sm flex items-center justify-center"
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
                Imprimer le certificat
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Le certificat sera généré avec un format professionnel conforme
                aux exigences administratives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
