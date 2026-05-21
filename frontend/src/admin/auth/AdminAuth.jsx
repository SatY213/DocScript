import React, { useState } from "react";
import { handleLogin } from ".";
import { LuShield } from "react-icons/lu";
export const AdminAuth = ({}) => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setLoginForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error for this field when user types
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!loginForm.email.trim()) {
      newErrors.email = "L'email administrateur est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      newErrors.email = "Format d'email invalide";
    } else if (!loginForm.email.endsWith("@admin.doc.com")) {
      newErrors.email = "Seuls les emails administrateur sont autorisés";
    }

    if (!loginForm.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (loginForm.password.length < 8) {
      newErrors.password = "Minimum 8 caractères requis";
    }

    if (showTwoFactor && !loginForm.twoFactorCode.trim()) {
      newErrors.twoFactorCode = "Le code 2FA est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // First stage: email/password validation
      if (!showTwoFactor) {
        // Simulate API call to check credentials and trigger 2FA
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // For demo: any valid email/password triggers 2FA
        // In production, this would be your actual API call
        setShowTwoFactor(true);
        setLoading(false);
        return;
      }

      // Second stage: complete login with 2FA
      await handleLogin(
        {
          ...loginForm,
          rememberMe,
          isAdmin: true,
        },
        setLoading
      );
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general:
          error.message || "Erreur d'authentification. Veuillez réessayer.",
      });
      setLoading(false);
    }
  };

  const handleResetTwoFactor = () => {
    setShowTwoFactor(false);
    setLoginForm((prev) => ({ ...prev, twoFactorCode: "" }));
  };

  return (
    <div className="max-w-md w-full mx-auto py-12 px-6">
      {/* Admin Login Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-lg mb-4">
          <LuShield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Connexion Administrateur
        </h1>
        <p className="text-gray-600 text-sm">
          Accès sécurisé au panneau d'administration DocScript
        </p>
      </div>

      <form
        onSubmit={handleLoginSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200"
      >
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-red-700">{errors.general}</span>
            </div>
          </div>
        )}

        {/* Email/Password Stage */}
        {!showTwoFactor ? (
          <>
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Administrateur
              </label>
              <input
                type="email"
                id="admin-email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-sm ${
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="admin@doc.com"
                autoComplete="username"
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe Administrateur
              </label>
              <input
                type="password"
                id="admin-password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-sm ${
                  errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-2 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleLoginChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Se souvenir de moi
                </span>
              </label>

              <button
                type="button"
                className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </>
        ) : (
          /* Two-Factor Authentication Stage */
          <>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Vérification en deux étapes
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Entrez le code à 6 chiffres depuis votre application
                d'authentification
              </p>
            </div>

            <div>
              <label
                htmlFor="two-factor-code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Code d'authentification
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="two-factor-code"
                  name="twoFactorCode"
                  value={loginForm.twoFactorCode}
                  onChange={handleLoginChange}
                  required
                  maxLength="6"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-sm text-center text-lg tracking-widest font-mono ${
                    errors.twoFactorCode
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  autoFocus
                />
                <div className="absolute right-3 top-3">
                  <span className="text-xs text-gray-400">6 chiffres</span>
                </div>
              </div>
              {errors.twoFactorCode && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.twoFactorCode}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleResetTwoFactor}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Retour à l'identifiant
              </button>

              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Problème avec le code ?
              </button>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center">
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
              {showTwoFactor ? "Vérification..." : "Connexion..."}
            </span>
          ) : showTwoFactor ? (
            "Vérifier et se connecter"
          ) : (
            "Se connecter"
          )}
        </button>

        {/* Login Logs Notice */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            <svg
              className="inline w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Toutes les connexions sont journalisées et surveillées
          </p>
        </div>
      </form>

      {/* Support Contact */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Problème d'accès ?{" "}
          <a
            href="mailto:admin-support@doc.com"
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Contacter le support administrateur
          </a>
        </p>
      </div>
    </div>
  );
};
