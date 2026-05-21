import React, { useState } from "react";
import { handleAddAssistant } from "./form";

function AssistantForm({ onAddAssistant, setShowAddAssistant }) {
  const [assistantForm, setAssistantForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    permissions: [
      { route: "patients", canView: true, canEdit: false },
      { route: "prescriptions", canView: true, canEdit: false },
      { route: "stock", canView: true, canEdit: false },
      { route: "invoices", canView: true, canEdit: false },
      { route: "appointments", canView: true, canEdit: false },
      { route: "settings", canView: false, canEdit: false },
    ],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleAssistantChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle permission checkboxes
    if (name.startsWith("perm_")) {
      const [_, module, permission] = name.split("_");

      setAssistantForm((prev) => {
        // Find if permission for this route already exists
        const existingPermIndex = prev.permissions.findIndex(
          (p) => p.route === module
        );

        if (existingPermIndex >= 0) {
          // Update existing permission
          const updatedPermissions = [...prev.permissions];
          updatedPermissions[existingPermIndex] = {
            ...updatedPermissions[existingPermIndex],
            [permission === "view" ? "canView" : "canEdit"]: checked,
          };

          // If disabling view, also disable edit
          if (permission === "view" && !checked) {
            updatedPermissions[existingPermIndex].canEdit = false;
          }

          return {
            ...prev,
            permissions: updatedPermissions,
          };
        } else {
          // Create new permission
          const newPermission = {
            route: module,
            canView: permission === "view" ? checked : false,
            canEdit: permission === "edit" ? checked : false,
          };

          return {
            ...prev,
            permissions: [...prev.permissions, newPermission],
          };
        }
      });
    } else {
      setAssistantForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateAssistantForm = () => {
    const newErrors = {};

    if (!assistantForm.fullName.trim()) {
      newErrors.fullName = "Le nom complet est requis";
    }

    if (!assistantForm.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(assistantForm.email)) {
      newErrors.email = "Email invalide";
    }

    if (!assistantForm.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (assistantForm.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (assistantForm.password !== assistantForm.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setAssistantForm({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      permissions: [
        { route: "patients", canView: true, canEdit: false },
        { route: "prescriptions", canView: true, canEdit: false },
        { route: "stock", canView: true, canEdit: false },
        { route: "invoices", canView: true, canEdit: false },
        { route: "appointments", canView: true, canEdit: false },
        { route: "settings", canView: false, canEdit: false },
      ],
    });
    setErrors({});
    if (onClose) {
      onClose();
    }
  };

  // Helper function to get display name for route
  const getRouteDisplayName = (route) => {
    const routeNames = {
      patients: "Patients",
      prescriptions: "Ordonnances",
      stock: "Stock",
      invoices: "Factures",
      appointments: "Rendez-vous",
      settings: "Paramètres",
    };
    return routeNames[route] || route;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Ajouter un Assistant
          </h3>
          <button
            onClick={() => {
              setShowAddAssistant(false);
              resetForm();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAssistant(
              assistantForm,
              setLoading,
              setShowAddAssistant,
              resetForm
            );
          }}
        >
          <div className="space-y-6">
            {/* Assistant Info - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={assistantForm.fullName}
                  onChange={handleAssistantChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors.fullName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Nom complet"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={assistantForm.email}
                  onChange={handleAssistantChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="email@exemple.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={assistantForm.phone}
                  onChange={handleAssistantChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  placeholder="+212 6 XX XX XX XX"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={assistantForm.password}
                  onChange={handleAssistantChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 6 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={assistantForm.confirmPassword}
                  onChange={handleAssistantChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assistantForm.permissions.map((permission) => (
                    <div
                      key={permission.route}
                      className="border border-gray-200 rounded-lg p-3 bg-white"
                    >
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {getRouteDisplayName(permission.route)}
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name={`perm_${permission.route}_view`}
                            checked={permission.canView}
                            onChange={handleAssistantChange}
                            className="mr-2 h-4 w-4 text-[#54c2bc] focus:ring-[#54c2bc] border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            Visualisation
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name={`perm_${permission.route}_edit`}
                            checked={permission.canEdit}
                            onChange={handleAssistantChange}
                            disabled={!permission.canView}
                            className="mr-2 h-4 w-4 text-[#54c2bc] focus:ring-[#54c2bc] border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span
                            className={`text-sm ${
                              !permission.canView
                                ? "text-gray-400"
                                : "text-gray-700"
                            }`}
                          >
                            Modification
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  <span className="font-medium">Note:</span> La modification
                  nécessite que la visualisation soit activée
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowAddAssistant(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {loading ? (
                <span className="flex items-center">
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
                  Ajout en cours...
                </span>
              ) : (
                "Ajouter l'assistant"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssistantForm;
