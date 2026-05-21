// AuthentificationPage.jsx
import React, { useState } from "react";
import { LoginComponent } from "./components/LoginComponent";
import { RegisterComponent } from "./components/RegisterComponent";

const AuthentificationPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const switchToRegister = () => {
    setActiveTab(1);
  };

  const switchToLogin = () => {
    setActiveTab(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue</h1>
            <p className="text-gray-600 text-sm">
              Accédez à votre espace professionnel
            </p>
          </div>

          {/* Custom Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab(0)}
              className={`flex-1 py-2 text-center font-medium text-sm transition-colors ${
                activeTab === 0
                  ? "text-[#54c2bc] border-b-2 border-[#54c2bc]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`flex-1 py-2 text-center font-medium text-sm transition-colors ${
                activeTab === 1
                  ? "text-[#54c2bc] border-b-2 border-[#54c2bc]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Inscription
            </button>
          </div>

          {activeTab === 0 && (
            <LoginComponent switchToRegister={switchToRegister} />
          )}

          {activeTab === 1 && (
            <RegisterComponent switchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthentificationPage;
