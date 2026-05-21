import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { calculateAge, fetchDocument, handleSubmit, validateForm } from ".";

const CreateEditPatient = ({ patient = null, onSave }) => {
  const [formData, setFormData] = useState({
    // Informations personnelles
    personalInfo: {
      firstName: patient?.personalInfo?.firstName || "",
      lastName: patient?.personalInfo?.lastName || "",
      birthDate: patient?.personalInfo?.birthDate || "",
      sexe: patient?.personalInfo?.sexe || "",
      phone: patient?.personalInfo?.phone || "",
      email: patient?.personalInfo?.email || "",
      address: patient?.personalInfo?.address || "",
      civilState: patient?.personalInfo?.civilState || "",
      profession: patient?.personalInfo?.profession || "",
      employer: patient?.personalInfo?.employer || "",
      socialSecutiryNumber: patient?.personalInfo?.socialSecutiryNumber || "",
      chifaCardNumber: patient?.personalInfo?.chifaCardNumber || "",
    },
    // Information médicale
    medicalInfo: {
      bloodGroup: patient?.medicalInfo?.bloodGroup || "",
      weight: patient?.medicalInfo?.weight || "",
      height: patient?.medicalInfo?.height || "",
      CranialPerimeter: patient?.medicalInfo?.CranialPerimeter || "",
      medicalHistory: patient?.medicalInfo?.medicalHistory || "",
      drugAllergies: patient?.medicalInfo?.drugAllergies || "",
      chronicIllnesses: patient?.medicalInfo?.chronicIllnesses || "",
      medicalFollowUp: patient?.medicalInfo?.medicalFollowUp || "",
    },
    // Contact d'urgence
    emergencyContact: {
      fullName: patient?.emergencyContact?.fullName || "",
      relationship: patient?.emergencyContact?.relationship || "",
      phone: patient?.emergencyContact?.phone || "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetchDocument(id, setFormData, setLoading);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split(".");

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      formData.personalInfo.firstName,
      formData.personalInfo.lastName,
      formData.personalInfo.birthDate,
      formData.personalInfo.sexe,
      formData.personalInfo.phone,
      formData.personalInfo.email,
    ];

    return requiredFields.every(
      (field) => field && field.toString().trim() !== ""
    );
  };

  const onCancel = () => {
    navigate("/dashboard/patients");
  };
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {patient ? "Modifier le Patient" : "Nouveau Patient"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {patient
            ? "Modifiez les informations du patient"
            : "Ajoutez un nouveau patient à votre base de données"}
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
          {/* Informations Personnelles */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Informations Personnelles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="personalInfo.firstName"
                  value={formData.personalInfo.firstName}
                  required
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors["personalInfo.firstName"]
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Prénom du patient"
                />
                {errors["personalInfo.firstName"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["personalInfo.firstName"]}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="personalInfo.lastName"
                  value={formData.personalInfo.lastName}
                  required
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors["personalInfo.lastName"]
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Nom du patient"
                />
                {errors["personalInfo.lastName"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["personalInfo.lastName"]}
                  </p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  name="personalInfo.birthDate"
                  value={formData.personalInfo.birthDate?.slice(0, 10) || ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors["personalInfo.birthDate"]
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {errors["personalInfo.birthDate"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["personalInfo.birthDate"]}
                  </p>
                )}
              </div>

              {/* Age (auto-calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Âge
                </label>
                <input
                  type="number"
                  value={calculateAge(formData.personalInfo.birthDate)}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none"
                  placeholder="Calculé automatiquement"
                />
              </div>

              {/* Sexe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexe <span className="text-red-600">*</span>
                </label>
                <select
                  name="personalInfo.sexe"
                  value={formData.personalInfo.sexe}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors["personalInfo.sexe"]
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Sélectionnez le sexe</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
                {errors["personalInfo.sexe"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["personalInfo.sexe"]}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="personalInfo.phone"
                  value={formData.personalInfo.phone}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors["personalInfo.phone"]
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="01 23 45 67 89"
                />
                {errors["personalInfo.phone"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["personalInfo.phone"]}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="personalInfo.email"
                  value={formData.personalInfo.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors["personalInfo.email"]
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="patient@email.com"
                />
                {errors["personalInfo.email"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["personalInfo.email"]}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <textarea
                  name="personalInfo.address"
                  value={formData.personalInfo.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="Adresse complète du patient"
                />
              </div>

              {/* Civil State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État civil
                </label>
                <select
                  name="personalInfo.civilState"
                  value={formData.personalInfo.civilState}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                >
                  <option value="">Sélectionnez l'état civil</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf(ve)">Veuf(ve)</option>
                </select>
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  name="personalInfo.profession"
                  value={formData.personalInfo.profession}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="Profession du patient"
                />
              </div>

              {/* Employer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employeur
                </label>
                <input
                  type="text"
                  name="personalInfo.employer"
                  value={formData.personalInfo.employer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="Nom de l'employeur"
                />
              </div>

              {/* Social Security Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de sécurité sociale
                </label>
                <input
                  type="text"
                  name="personalInfo.socialSecutiryNumber"
                  value={formData.personalInfo.socialSecutiryNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="1 85 08 75 115 035 34"
                />
              </div>

              {/* CHIFA Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de carte CHIFA
                </label>
                <input
                  type="text"
                  name="personalInfo.chifaCardNumber"
                  value={formData.personalInfo.chifaCardNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="Numéro de carte CHIFA"
                />
              </div>
            </div>
          </div>

          {/* Information Médicale */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Information Médicale
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Groupe sanguin
                </label>
                <select
                  name="medicalInfo.bloodGroup"
                  value={formData.medicalInfo.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                >
                  <option value="">Sélectionnez le groupe sanguin</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  name="medicalInfo.weight"
                  value={formData.medicalInfo.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="70"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  name="medicalInfo.height"
                  value={formData.medicalInfo.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="175"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Cranial Perimeter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Périmètre cranien (cm)
                </label>
                <input
                  type="number"
                  name="medicalInfo.CranialPerimeter"
                  value={formData.medicalInfo.CranialPerimeter}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="55"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Medical History */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antécédents médicaux
                </label>
                <textarea
                  name="medicalInfo.medicalHistory"
                  value={formData.medicalInfo.medicalHistory}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="Antécédents médicaux du patient..."
                />
              </div>

              {/* Drug Allergies */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies médicamenteuses
                </label>
                <textarea
                  name="medicalInfo.drugAllergies"
                  value={formData.medicalInfo.drugAllergies}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="Liste des allergies médicamenteuses..."
                />
              </div>

              {/* Chronic Illnesses */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maladies chroniques
                </label>
                <textarea
                  name="medicalInfo.chronicIllnesses"
                  value={formData.medicalInfo.chronicIllnesses}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="Maladies chroniques diagnostiquées..."
                />
              </div>

              {/* Medical Follow Up */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suivi médical
                </label>
                <textarea
                  name="medicalInfo.medicalFollowUp"
                  value={formData.medicalInfo.medicalFollowUp}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="Traitements en cours et suivi médical..."
                />
              </div>
            </div>
          </div>

          {/* Contact d'urgence */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Contact d'urgence
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="emergencyContact.fullName"
                  value={formData.emergencyContact.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="Nom du contact d'urgence"
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu de parenté
                </label>
                <select
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                >
                  <option value="">Sélectionnez la parenté</option>
                  <option value="Conjoint(e)">Conjoint(e)</option>
                  <option value="Parent">Parent</option>
                  <option value="Enfant">Enfant</option>
                  <option value="Frère/Soeur">Frère/Soeur</option>
                  <option value="Ami(e)">Ami(e)</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="01 23 45 67 89"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 mt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!isFormValid()}
            className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {id ? "Modifier le Patient" : "Créer le Patient"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPatient;
