import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDocument, handleSubmit, validateForm } from ".";

const CreateEditArticle = ({ article = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: article?.name || "",
    quantity: article?.quantity || 0,
    unit: article?.unit || "",
    lowQuantity: article?.lowQuantity || 0,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Common units for articles
  const units = [
    "Pièce",
    "Boîte",
    "Carton",
    "Paquet",
    "Rouleau",
    "Litre",
    "Kilogramme",
    "Mètre",
    "Centimètre",
    "Millilitre",
    "Gramme",
    "Autre",
  ];

  useEffect(() => {
    if (id) {
      // Fetch article data if editing
      fetchDocument(id, setFormData, setLoading);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      quantity: value,
    }));
  };

  const handleLowQuantityChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      lowQuantity: value,
    }));
  };

  const onCancel = () => {
    window.scrollTo(0, 0);
    navigate("/dashboard/stock");
  };

  const isFormValid = () => {
    return formData.name && formData.name.trim() !== "";
  };

  if (loading && id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#54c2bc] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {id ? "Modifier l'Article" : "Nouvel Article"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {id
            ? "Modifiez les informations de l'article"
            : "Ajoutez un nouvel article à votre inventaire"}
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
          {/* Nom de l'Article */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'article <span className="text-red-600">*</span>
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
              placeholder="Ex: Gants stériles, Masques chirurgicaux, Seringues..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Quantity and Unit in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité en stock
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Unité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unité
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                placeholder="Ex: Boite, Pièce"
              />
            </div>
          </div>

          {/* Seuil d'alerte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seuil d'alerte (quantité basse)
            </label>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="number"
                  name="lowQuantity"
                  value={formData.lowQuantity}
                  onChange={handleLowQuantityChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-500">
                Une alerte sera déclenchée lorsque la quantité tombera en
                dessous de cette valeur
              </p>
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
            disabled={!isFormValid() || loading}
            className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {id ? "Modification..." : "Création..."}
              </>
            ) : id ? (
              "Modifier l'Article"
            ) : (
              "Créer l'Article"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditArticle;
