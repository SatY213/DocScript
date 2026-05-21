import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDocument, handleSubmit, validateForm } from ".";

const CreateEditMedicine = ({ medicine = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: medicine?.name || "",
    therapeuticClass: medicine?.therapeuticClass || "",
    dosage: medicine?.dosage || "",
    shapes: medicine?.shapes || "",
    note: medicine?.note || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Fetch medicine data if editing
      fetchDocument(id, setFormData, setLoading);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const onCancel = () => {
    window.scrollTo(0, 0);
    navigate("/dashboard/medicines");
  };

  const isFormValid = () => {
    return formData.name && formData.name.trim() !== "";
  };

  if (loading && id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader animate-spin rounded-full h-12 w-12 border-4 border-[#54c2bc] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {id ? "Modifier le Médicament" : "Nouveau Médicament"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {id
            ? "Modifiez les informations du médicament"
            : "Ajoutez un nouveau médicament à votre base de données"}
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
        <div className="space-y-6">
          {/* Nom du Médicament */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du médicament <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Ex: Paracétamol, Amoxicilline..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Classe Thérapeutique */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe thérapeutique
            </label>
            <input
              type="text"
              name="therapeuticClass"
              value={formData.therapeuticClass}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Ex: Analgésique, Antibiotique, Antihypertenseur..."
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dosage
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Ex: 500mg, 1000mg, 20mg/ml..."
            />
          </div>

          {/* shapes Galéniques */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formes galéniques
            </label>
            <input
              type="text"
              name="shapes"
              value={formData.shapes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Ex: Capsule, Comprimé, Sirop..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes et précautions
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              placeholder="Informations importantes: contre-indications, effets secondaires, précautions d'emploi..."
            />
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
            disabled={!isFormValid() || loading}
            className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {id ? "Modification..." : "Création..."}
              </>
            ) : id ? (
              "Modifier le Médicament"
            ) : (
              "Créer le Médicament"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditMedicine;
