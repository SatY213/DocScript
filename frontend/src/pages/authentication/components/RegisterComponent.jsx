import React, { useState } from "react";
import { handleRegister } from "..";
export const RegisterComponent = ({ switchToLogin }) => {
  const [registerForm, setRegisterForm] = useState({
    title: "Dr",
    fullName: "",
    speciality: "",
    firmName: "",
    email: "",
    phone: "",
    password: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const handleRegisterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    console.log("Register form submitted:", registerForm);
    handleRegister(registerForm, setLoading);
    // Add your registration logic here
  };

  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Title - Smaller width */}
        <div className="sm:w-1/4">
          <label
            htmlFor="titre"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Titre
          </label>
          <select
            id="title"
            name="title"
            value={registerForm.title}
            onChange={handleRegisterChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent transition-all text-sm appearance-none bg-white"
          >
            <option value="Dr">Dr.</option>
            <option value="Pr">Pr.</option>
          </select>
        </div>

        {/* Nom complet - Larger width */}
        <div className="sm:w-3/4">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nom complet
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={registerForm.fullName}
            onChange={handleRegisterChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent transition-all text-sm"
            placeholder="Votre nom complet"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="speciality"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Spécialité
          </label>
          <input
            type="text"
            id="speciality"
            name="speciality"
            value={registerForm.speciality}
            onChange={handleRegisterChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent transition-all text-sm"
            placeholder="Votre spécialité"
          />
        </div>

        <div>
          <label
            htmlFor="nom-cabinet"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nom du cabinet/Clinique
          </label>
          <input
            type="text"
            id="firmName"
            name="firmName"
            value={registerForm.firmName}
            onChange={handleRegisterChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent transition-all text-sm"
            placeholder="Nom de votre cabinet"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="register-email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="register-email"
            name="email"
            value={registerForm.email}
            onChange={handleRegisterChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent transition-all text-sm"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={registerForm.phone}
            onChange={handleRegisterChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent transition-all text-sm"
            placeholder="Votre numéro"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="register-password"
          name="password"
          value={registerForm.password}
          onChange={handleRegisterChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent transition-all text-sm"
          placeholder="Créez un mot de passe"
        />
      </div>

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="accept-terms"
          name="acceptTerms"
          checked={registerForm.acceptTerms}
          onChange={handleRegisterChange}
          required
          className="mt-1 w-4 h-4 text-[#54c2bc] bg-gray-100 border-gray-300 rounded focus:ring-[#54c2bc] focus:ring-2"
        />
        <label
          htmlFor="accept-terms"
          className="text-sm text-gray-700 leading-5"
        >
          En continuant, vous acceptez notre politique de confidentialité
        </label>
      </div>

      <button
        type="submit"
        disabled={!registerForm.acceptTerms}
        className="w-full bg-[#54c2bc] text-white py-3 rounded-lg font-medium hover:bg-[#3BAAA4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        S'inscrire
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Vous avez déjà un compte ?{" "}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-[#54c2bc] hover:text-[#3BAAA4] transition-colors font-semibold"
          >
            Se connecter
          </button>
        </p>
      </div>
    </form>
  );
};
