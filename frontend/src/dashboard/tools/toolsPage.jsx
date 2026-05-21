// ToolsPage.js
import React from "react";
import CalculIMC from "./components/calcul-imc";
import CalculDosage from "./components/calcul-dosage";
import GrowthCurve from "./components/growth-curve";

export default function ToolsPage() {
  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Outils Médicaux
        </h1>
        <p className="text-gray-600">
          Calculs et outils pratiques pour la pratique médicale quotidienne
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calcul IMC */}
        <CalculIMC />

        {/* Calcul de Dosage */}
        <CalculDosage />

        {/* Courbes de Croissance */}
        <GrowthCurve />
      </div>
    </div>
  );
}

// Composant Calcul IMC

// Composant Calcul de Dosage

// Composant Courbes de Croissance
