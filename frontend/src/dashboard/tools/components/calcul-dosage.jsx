import React, { useState } from "react";
import gelluleSvg from "../../../utils/icons/gellule.svg";

function CalculDosage() {
  const [dosePerKg, setDosePerKg] = useState("");
  const [patientWeight, setPatientWeight] = useState("");
  const [frequency, setFrequency] = useState(1);
  const [result, setResult] = useState(null);

  const calculateDosage = () => {
    if (dosePerKg && patientWeight) {
      const doseMgKg = parseFloat(dosePerKg);
      const weight = parseFloat(patientWeight);
      const dailyDose = doseMgKg * weight;
      const dosePerAdministration = dailyDose / frequency;

      setResult({
        dailyDose: dailyDose.toFixed(1),
        perAdministration: dosePerAdministration.toFixed(1),
        weight: weight,
        dosePerKg: doseMgKg,
        frequency: frequency,
      });
    }
  };

  const resetFields = () => {
    setDosePerKg("");
    setPatientWeight("");
    setFrequency(1);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <div className=" w-8 h-8 flex items-center justify-center text-sm mr-3">
          <img
            src={gelluleSvg}
            alt="Gellule"
            className="text-[#54c2bc] "
          />{" "}
        </div>
        Calcul de Dosage Médicamenteux
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dose (mg/kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={dosePerKg}
            onChange={(e) => setDosePerKg(e.target.value)}
            placeholder="Ex: 10"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poids du patient (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={patientWeight}
            onChange={(e) => setPatientWeight(e.target.value)}
            placeholder="Ex: 70"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de prises par jour
          </label>
          <input
            type="number"
            step="1"
            min="1"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value))}
            placeholder="Ex: 70"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={calculateDosage}
            disabled={!dosePerKg || !patientWeight}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              dosePerKg && patientWeight
                ? "bg-[#54c2bc] text-white hover:bg-[#3BAAA4]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Calculer le dosage
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
            <h3 className="font-medium text-gray-900 mb-3">
              Résultat du dosage
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dose journalière totale:</span>
                <span className="font-medium text-gray-900">
                  {result.dailyDose} mg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dose par administration:</span>
                <span className="font-medium text-gray-900">
                  {result.perAdministration} mg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fréquence:</span>
                <span className="font-medium text-gray-900">
                  {result.frequency} fois/jour
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="bg-blue-50 p-2 rounded text-center">
                  <p className="text-xs text-blue-800">
                    Calcul basé sur: {result.dosePerKg} mg/kg × {result.weight}{" "}
                    kg = {result.dailyDose} mg/jour
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalculDosage;
