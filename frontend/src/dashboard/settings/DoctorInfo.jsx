// DoctorInfo.js
import React, { useEffect, useRef, useState } from "react";
import { wilayas } from "./data";
import { getUserInfo, handleSaveDoctorInfo } from ".";
import { apiLink } from "../../api/api";

function DoctorInfo({
  doctorForm,
  setDoctorForm,
  loading,
  setLoading,
  errors,
  setErrors,
}) {
  const fileInputRef = useRef(null);
  // Load doctor info on component mount
  useEffect(() => {
    getUserInfo(setDoctorForm, setLoading);
  }, []);

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (errors && errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Veuillez sélectionner une image (JPG, PNG, GIF, WEBP)");
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert("La taille de l'image ne doit pas dépasser 2MB");
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setDoctorForm((prev) => ({
          ...prev,
          new_picture: reader.result,
          pictureFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRemovePicture = () => {
    setDoctorForm((prev) => ({
      ...prev,
      picture: null,
      new_picture: null,
      pictureFile: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSaveDoctorInfo(
      setDoctorForm,
      doctorForm,
      setLoading,
      setErrors,
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">
          Informations Professionnelles
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Mettez à jour vos informations de médecin
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de profil
            </label>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {doctorForm?.picture || doctorForm?.new_picture ? (
                  <img
                    src={
                      doctorForm.new_picture
                        ? doctorForm.new_picture
                        : doctorForm.picture?.startsWith("http")
                          ? doctorForm.picture
                          : `${apiLink}/cdn/pictures/${doctorForm.picture}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#54c2bc] to-[#3BAAA4] flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {doctorForm?.fullName?.[0]?.toUpperCase() || "D"}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePictureChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Changer la photo
                </button>
                {(doctorForm?.picture || doctorForm?.new_picture) && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors block"
                  >
                    Supprimer la photo
                  </button>
                )}
                <p className="text-xs text-gray-500">
                  JPG, PNG, GIF ou WEBP, taille max. 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={doctorForm?.fullName || ""}
              onChange={handleDoctorChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Dr. Prénom Nom"
            />
            {errors?.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Speciality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spécialité <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="speciality"
              value={doctorForm?.speciality || ""}
              onChange={handleDoctorChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Votre spécialité"
            />
            {errors?.speciality && (
              <p className="text-xs text-red-600 mt-1">{errors.speciality}</p>
            )}
          </div>

          {/* firmName */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de votre cabinet <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="firmName"
              value={doctorForm?.firmName || ""}
              onChange={handleDoctorChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Nom de votre cabinet"
            />
            {errors?.firmName && (
              <p className="text-xs text-red-600 mt-1">{errors.firmName}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse du cabinet
            </label>
            <input
              type="text"
              name="address"
              value={doctorForm?.address || ""}
              onChange={handleDoctorChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Adresse complète"
            />
          </div>

          {/* Wilaya */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wilaya <span className="text-red-600">*</span>
            </label>
            <select
              name="city"
              value={doctorForm?.city || ""}
              onChange={handleDoctorChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
            >
              <option value="">Sélectionner une wilaya</option>
              {wilayas?.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
            {errors?.city && (
              <p className="text-xs text-red-600 mt-1">{errors.city}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={doctorForm?.phone || ""}
              onChange={handleDoctorChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="05 00 00 00 00"
            />
            {errors?.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* CNOM Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              N° d'inscription (CNOM) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="cnom"
              value={doctorForm?.cnom || ""}
              onChange={handleDoctorChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="CNOM123456"
            />
            {errors?.cnom && (
              <p className="text-xs text-red-600 mt-1">{errors.cnom}</p>
            )}
          </div>

          {/* NIF/RC Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              N° d'identification fiscale (NIF/RC)
            </label>
            <input
              type="text"
              name="nif"
              value={doctorForm?.nif || ""}
              onChange={handleDoctorChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="NIF123456789"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 mt-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DoctorInfo;
