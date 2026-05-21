import React, { useState } from "react";
import calculeurSVG from "../../../utils/icons/calculateurs.svg";
function CalculIMC() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);

  const calculateIMC = () => {
    if (weight && height) {
      const weightKg = parseFloat(weight);
      const heightM = parseFloat(height) / 100; // Convert cm to m
      const imc = weightKg / (heightM * heightM);

      let interpretation = "";
      let color = "";

      if (imc < 16.5) {
        interpretation = "Dénutrition sévère";
        color = "text-red-600";
      } else if (imc < 18.5) {
        interpretation = "Maigreur";
        color = "text-orange-500";
      } else if (imc < 25) {
        interpretation = "Corpulence normale";
        color = "text-green-600";
      } else if (imc < 30) {
        interpretation = "Surpoids";
        color = "text-orange-500";
      } else if (imc < 35) {
        interpretation = "Obésité modérée";
        color = "text-red-600";
      } else if (imc < 40) {
        interpretation = "Obésité sévère";
        color = "text-red-700";
      } else {
        interpretation = "Obésité morbide";
        color = "text-red-800";
      }

      setResult({
        value: imc.toFixed(1),
        interpretation,
        color,
      });
    }
  };

  const resetFields = () => {
    setWeight("");
    setHeight("");
    setResult(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <div className=" w-8 h-8 flex items-center justify-center text-sm mr-3">
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        Calcul de l'IMC
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poids (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ex: 70"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Ex: 175"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={calculateIMC}
            disabled={!weight || !height}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              weight && height
                ? "bg-[#54c2bc] text-white hover:bg-[#3BAAA4]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Calculer l'IMC
          </button>
          <button
            onClick={resetFields}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Réinitialiser
          </button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Votre IMC</p>
              <p className="text-4xl font-bold text-gray-900">{result.value}</p>
              <p className={`text-sm font-medium mt-2 ${result.color}`}>
                {result.interpretation}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#54c2bc] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((result.value / 50) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>16.5</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
                <span>40</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default CalculIMC;
