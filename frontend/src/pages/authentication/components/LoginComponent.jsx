import React, { useState } from "react";
import { handleLogin } from "..";
export const LoginComponent = ({ switchToRegister }) => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    console.log("Login form submitted:", loginForm);
    // Add your login logic here
    handleLogin(loginForm, setLoading);
  };

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="login-email"
          name="email"
          value={loginForm.email}
          onChange={handleLoginChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent transition-all text-sm"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="login-password"
          name="password"
          value={loginForm.password}
          onChange={handleLoginChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent transition-all text-sm"
          placeholder="Votre mot de passe"
        />
      </div>

      <div className="text-right">
        <button
          type="button"
          className="text-[#54c2bc] hover:text-[#3BAAA4] transition-colors text-sm font-medium"
        >
          Mot de passe oublié ?
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-[#54c2bc] text-white py-3 rounded-lg font-medium hover:bg-[#3BAAA4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:ring-offset-2 text-sm"
      >
        Se connecter
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
          Vous n'avez pas de compte ?{" "}
          <button
            type="button"
            onClick={switchToRegister}
            className="text-[#54c2bc] hover:text-[#3BAAA4] transition-colors font-semibold"
          >
            S'inscrire
          </button>
        </p>
      </div>
    </form>
  );
};
