// GrowthCurve.js
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import babySvg from "../../../utils/icons/baby.svg";

// Données OMS pour les filles (poids en kg)
const whoDataGirls = {
  poids: [
    { age: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
    { age: 1, p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.5 },
    { age: 2, p3: 4.0, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.6 },
    { age: 3, p3: 4.7, p15: 5.2, p50: 5.8, p85: 6.6, p97: 7.5 },
    { age: 4, p3: 5.3, p15: 5.9, p50: 6.6, p85: 7.4, p97: 8.4 },
    { age: 5, p3: 5.8, p15: 6.4, p50: 7.2, p85: 8.1, p97: 9.2 },
    { age: 6, p3: 6.2, p15: 6.9, p50: 7.7, p85: 8.7, p97: 9.9 },
    { age: 7, p3: 6.6, p15: 7.3, p50: 8.2, p85: 9.2, p97: 10.5 },
    { age: 8, p3: 7.0, p15: 7.7, p50: 8.6, p85: 9.7, p97: 11.1 },
    { age: 9, p3: 7.3, p15: 8.1, p50: 9.0, p85: 10.2, p97: 11.6 },
    { age: 10, p3: 7.6, p15: 8.4, p50: 9.4, p85: 10.6, p97: 12.1 },
    { age: 11, p3: 7.9, p15: 8.8, p50: 9.8, p85: 11.0, p97: 12.6 },
    { age: 12, p3: 8.2, p15: 9.1, p50: 10.2, p85: 11.5, p97: 13.1 },
    { age: 13, p3: 8.5, p15: 9.4, p50: 10.5, p85: 11.9, p97: 13.6 },
    { age: 14, p3: 8.8, p15: 9.7, p50: 10.9, p85: 12.3, p97: 14.1 },
    { age: 15, p3: 9.1, p15: 10.0, p50: 11.2, p85: 12.7, p97: 14.5 },
    { age: 16, p3: 9.4, p15: 10.3, p50: 11.5, p85: 13.0, p97: 14.9 },
    { age: 17, p3: 9.6, p15: 10.6, p50: 11.9, p85: 13.4, p97: 15.3 },
    { age: 18, p3: 9.8, p15: 10.9, p50: 12.2, p85: 13.7, p97: 15.7 },
    { age: 19, p3: 10.0, p15: 11.1, p50: 12.5, p85: 14.0, p97: 16.0 },
    { age: 20, p3: 10.2, p15: 11.3, p50: 12.7, p85: 14.3, p97: 16.3 },
    { age: 21, p3: 10.4, p15: 11.5, p50: 12.9, p85: 14.6, p97: 16.6 },
    { age: 22, p3: 10.6, p15: 11.7, p50: 13.1, p85: 14.8, p97: 16.9 },
    { age: 23, p3: 10.8, p15: 11.9, p50: 13.3, p85: 15.0, p97: 17.2 },
    { age: 24, p3: 11.0, p15: 12.1, p50: 13.5, p85: 15.2, p97: 17.5 },
  ],
  taille: [
    { age: 0, p3: 45.6, p15: 48.0, p50: 49.1, p85: 50.4, p97: 52.0 },
    { age: 1, p3: 50.8, p15: 53.0, p50: 54.7, p85: 56.4, p97: 58.0 },
    { age: 2, p3: 55.6, p15: 57.8, p50: 59.5, p85: 61.3, p97: 63.0 },
    { age: 3, p3: 59.5, p15: 61.8, p50: 63.7, p85: 65.6, p97: 67.5 },
    { age: 4, p3: 62.8, p15: 65.1, p50: 67.2, p85: 69.2, p97: 71.2 },
    { age: 5, p3: 65.7, p15: 68.1, p50: 70.1, p85: 72.3, p97: 74.4 },
    { age: 6, p3: 68.3, p15: 70.7, p50: 72.8, p85: 75.0, p97: 77.2 },
    { age: 7, p3: 70.6, p15: 73.1, p50: 75.2, p85: 77.5, p97: 79.8 },
    { age: 8, p3: 72.7, p15: 75.2, p50: 77.4, p85: 79.7, p97: 82.1 },
    { age: 9, p3: 74.7, p15: 77.2, p50: 79.4, p85: 81.8, p97: 84.3 },
    { age: 10, p3: 76.6, p15: 79.1, p50: 81.4, p85: 83.8, p97: 86.4 },
    { age: 11, p3: 78.4, p15: 80.9, p50: 83.2, p85: 85.7, p97: 88.4 },
    { age: 12, p3: 80.2, p15: 82.7, p50: 85.0, p85: 87.6, p97: 90.3 },
    { age: 13, p3: 81.9, p15: 84.5, p50: 86.8, p85: 89.4, p97: 92.2 },
    { age: 14, p3: 83.6, p15: 86.2, p50: 88.5, p85: 91.2, p97: 94.0 },
    { age: 15, p3: 85.3, p15: 87.9, p50: 90.2, p85: 92.9, p97: 95.8 },
    { age: 16, p3: 86.9, p15: 89.5, p50: 91.9, p85: 94.6, p97: 97.5 },
    { age: 17, p3: 88.5, p15: 91.1, p50: 93.5, p85: 96.3, p97: 99.2 },
    { age: 18, p3: 90.1, p15: 92.7, p50: 95.1, p85: 97.9, p97: 100.9 },
    { age: 19, p3: 91.7, p15: 94.3, p50: 96.7, p85: 99.5, p97: 102.5 },
    { age: 20, p3: 93.2, p15: 95.8, p50: 98.3, p85: 101.1, p97: 104.1 },
    { age: 21, p3: 94.7, p15: 97.3, p50: 99.8, p85: 102.7, p97: 105.7 },
    { age: 22, p3: 96.2, p15: 98.8, p50: 101.3, p85: 104.2, p97: 107.2 },
    { age: 23, p3: 97.7, p15: 100.3, p50: 102.8, p85: 105.7, p97: 108.8 },
    { age: 24, p3: 99.2, p15: 101.8, p50: 104.3, p85: 107.2, p97: 110.3 },
  ],
};

// Données OMS pour les garçons
const whoDataBoys = {
  poids: [
    { age: 0, p3: 2.5, p15: 2.9, p50: 3.5, p85: 4.0, p97: 4.6 },
    { age: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.8 },
    { age: 2, p3: 4.3, p15: 4.8, p50: 5.4, p85: 6.1, p97: 6.9 },
    { age: 3, p3: 5.0, p15: 5.6, p50: 6.3, p85: 7.0, p97: 7.9 },
    { age: 4, p3: 5.6, p15: 6.3, p50: 7.0, p85: 7.8, p97: 8.8 },
    { age: 5, p3: 6.1, p15: 6.8, p50: 7.6, p85: 8.5, p97: 9.6 },
    { age: 6, p3: 6.5, p15: 7.3, p50: 8.1, p85: 9.1, p97: 10.3 },
    { age: 7, p3: 7.0, p15: 7.8, p50: 8.7, p85: 9.7, p97: 11.0 },
    { age: 8, p3: 7.4, p15: 8.2, p50: 9.2, p85: 10.3, p97: 11.6 },
    { age: 9, p3: 7.8, p15: 8.7, p50: 9.7, p85: 10.9, p97: 12.3 },
    { age: 10, p3: 8.1, p15: 9.1, p50: 10.1, p85: 11.4, p97: 12.9 },
    { age: 11, p3: 8.5, p15: 9.5, p50: 10.6, p85: 11.9, p97: 13.5 },
    { age: 12, p3: 8.8, p15: 9.8, p50: 11.0, p85: 12.4, p97: 14.0 },
    { age: 13, p3: 9.1, p15: 10.2, p50: 11.4, p85: 12.9, p97: 14.6 },
    { age: 14, p3: 9.4, p15: 10.5, p50: 11.8, p85: 13.3, p97: 15.1 },
    { age: 15, p3: 9.7, p15: 10.8, p50: 12.2, p85: 13.7, p97: 15.6 },
    { age: 16, p3: 10.0, p15: 11.2, p50: 12.5, p85: 14.1, p97: 16.0 },
    { age: 17, p3: 10.3, p15: 11.5, p50: 12.9, p85: 14.5, p97: 16.5 },
    { age: 18, p3: 10.6, p15: 11.8, p50: 13.2, p85: 14.9, p97: 16.9 },
    { age: 19, p3: 10.9, p15: 12.1, p50: 13.6, p85: 15.3, p97: 17.4 },
    { age: 20, p3: 11.2, p15: 12.4, p50: 13.9, p85: 15.6, p97: 17.8 },
    { age: 21, p3: 11.5, p15: 12.7, p50: 14.2, p85: 16.0, p97: 18.2 },
    { age: 22, p3: 11.7, p15: 13.0, p50: 14.5, p85: 16.3, p97: 18.6 },
    { age: 23, p3: 12.0, p15: 13.3, p50: 14.8, p85: 16.6, p97: 18.9 },
    { age: 24, p3: 12.2, p15: 13.6, p50: 15.1, p85: 16.9, p97: 19.3 },
  ],
  taille: [
    { age: 0, p3: 46.1, p15: 48.5, p50: 50.5, p85: 52.0, p97: 53.7 },
    { age: 1, p3: 51.2, p15: 53.5, p50: 55.2, p85: 56.9, p97: 58.6 },
    { age: 2, p3: 56.2, p15: 58.5, p50: 60.4, p85: 62.2, p97: 64.0 },
    { age: 3, p3: 60.3, p15: 62.7, p50: 64.5, p85: 66.4, p97: 68.3 },
    { age: 4, p3: 63.7, p15: 66.1, p50: 68.0, p85: 69.9, p97: 71.9 },
    { age: 5, p3: 66.6, p15: 69.0, p50: 70.9, p85: 72.9, p97: 74.9 },
    { age: 6, p3: 69.2, p15: 71.6, p50: 73.6, p85: 75.6, p97: 77.7 },
    { age: 7, p3: 71.6, p15: 74.0, p50: 76.0, p85: 78.1, p97: 80.2 },
    { age: 8, p3: 73.8, p15: 76.2, p50: 78.2, p85: 80.3, p97: 82.5 },
    { age: 9, p3: 75.9, p15: 78.3, p50: 80.4, p85: 82.5, p97: 84.8 },
    { age: 10, p3: 78.0, p15: 80.4, p50: 82.4, p85: 84.6, p97: 86.9 },
    { age: 11, p3: 80.0, p15: 82.4, p50: 84.4, p85: 86.6, p97: 89.0 },
    { age: 12, p3: 81.9, p15: 84.3, p50: 86.4, p85: 88.6, p97: 91.0 },
    { age: 13, p3: 83.8, p15: 86.2, p50: 88.3, p85: 90.6, p97: 93.0 },
    { age: 14, p3: 85.6, p15: 88.0, p50: 90.1, p85: 92.5, p97: 94.9 },
    { age: 15, p3: 87.3, p15: 89.8, p50: 91.9, p85: 94.3, p97: 96.8 },
    { age: 16, p3: 89.0, p15: 91.5, p50: 93.7, p85: 96.1, p97: 98.6 },
    { age: 17, p3: 90.7, p15: 93.2, p50: 95.4, p85: 97.8, p97: 100.4 },
    { age: 18, p3: 92.3, p15: 94.8, p50: 97.0, p85: 99.5, p97: 102.1 },
    { age: 19, p3: 93.9, p15: 96.4, p50: 98.6, p85: 101.1, p97: 103.7 },
    { age: 20, p3: 95.5, p15: 98.0, p50: 100.2, p85: 102.7, p97: 105.3 },
    { age: 21, p3: 97.0, p15: 99.5, p50: 101.8, p85: 104.3, p97: 106.9 },
    { age: 22, p3: 98.5, p15: 101.0, p50: 103.3, p85: 105.8, p97: 108.5 },
    { age: 23, p3: 100.0, p15: 102.5, p50: 104.8, p85: 107.3, p97: 110.0 },
    { age: 24, p3: 101.5, p15: 104.0, p50: 106.3, p85: 108.8, p97: 111.5 },
  ],
};

// Données pour le périmètre crânien
const headCircumferenceData = {
  F: [
    { age: 0, p3: 31.9, p50: 34.5, p97: 37.0 },
    { age: 3, p3: 37.5, p50: 40.0, p97: 42.5 },
    { age: 6, p3: 40.5, p50: 43.0, p97: 45.5 },
    { age: 9, p3: 42.5, p50: 45.0, p97: 47.5 },
    { age: 12, p3: 44.0, p50: 46.5, p97: 49.0 },
    { age: 15, p3: 45.0, p50: 47.5, p97: 50.0 },
    { age: 18, p3: 45.8, p50: 48.3, p97: 50.8 },
    { age: 21, p3: 46.4, p50: 48.9, p97: 51.4 },
    { age: 24, p3: 46.9, p50: 49.4, p97: 51.9 },
  ],
  M: [
    { age: 0, p3: 32.6, p50: 35.1, p97: 37.6 },
    { age: 3, p3: 38.5, p50: 41.0, p97: 43.5 },
    { age: 6, p3: 41.5, p50: 44.0, p97: 46.5 },
    { age: 9, p3: 43.5, p50: 46.0, p97: 48.5 },
    { age: 12, p3: 45.0, p50: 47.5, p97: 50.0 },
    { age: 15, p3: 46.0, p50: 48.5, p97: 51.0 },
    { age: 18, p3: 46.8, p50: 49.3, p97: 51.8 },
    { age: 21, p3: 47.4, p50: 49.9, p97: 52.4 },
    { age: 24, p3: 47.9, p50: 50.4, p97: 52.9 },
  ],
};

function GrowthCurve() {
  const [selectedCurve, setSelectedCurve] = useState("poids");
  const [gender, setGender] = useState("F");
  const [patientAge, setPatientAge] = useState("");
  const [patientValue, setPatientValue] = useState("");
  const [patientPoint, setPatientPoint] = useState(null);
  const [percentile, setPercentile] = useState(null);

  const getCurrentData = () => {
    if (selectedCurve === "perimetre") {
      return headCircumferenceData[gender];
    }
    const dataSource = gender === "F" ? whoDataGirls : whoDataBoys;
    return dataSource[selectedCurve];
  };

  const calculatePercentile = () => {
    if (!patientAge || !patientValue) return;

    const data = getCurrentData();
    const age = parseFloat(patientAge);
    const value = parseFloat(patientValue);

    // Find the closest age data point
    const ageData = data.reduce((prev, curr) => {
      return Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev;
    });

    // Calculate percentile based on value
    let calculatedPercentile = 50;
    let color = "text-green-600";
    let interpretation = "Normale";

    if (selectedCurve === "perimetre") {
      if (value < ageData.p3) {
        calculatedPercentile = 3;
        color = "text-red-600";
        interpretation = "Microcéphalie (P<3)";
      } else if (value < ageData.p50) {
        calculatedPercentile = Math.round(
          ((value - ageData.p3) / (ageData.p50 - ageData.p3)) * 47 + 3,
        );
        color = "text-yellow-600";
        interpretation = "En dessous de la moyenne (P3-P50)";
      } else if (value < ageData.p97) {
        calculatedPercentile = Math.round(
          ((value - ageData.p50) / (ageData.p97 - ageData.p50)) * 47 + 50,
        );
        color = "text-green-600";
        interpretation = "Normale (P50-P97)";
      } else {
        calculatedPercentile = 97;
        color = "text-blue-600";
        interpretation = "Macrocéphalie (P>97)";
      }
    } else {
      if (value < ageData.p3) {
        calculatedPercentile = 3;
        color = "text-red-600";
        interpretation = "Très inférieur à la normale (P<3)";
      } else if (value < ageData.p15) {
        calculatedPercentile = Math.round(
          ((value - ageData.p3) / (ageData.p15 - ageData.p3)) * 12 + 3,
        );
        color = "text-orange-500";
        interpretation = "Inférieur à la normale (P3-P15)";
      } else if (value < ageData.p85) {
        calculatedPercentile = Math.round(
          ((value - ageData.p15) / (ageData.p85 - ageData.p15)) * 70 + 15,
        );
        color = "text-green-600";
        interpretation = "Normale (P15-P85)";
      } else if (value < ageData.p97) {
        calculatedPercentile = Math.round(
          ((value - ageData.p85) / (ageData.p97 - ageData.p85)) * 12 + 85,
        );
        color = "text-orange-500";
        interpretation = "Supérieur à la normale (P85-P97)";
      } else {
        calculatedPercentile = 97;
        color = "text-red-600";
        interpretation = "Très supérieur à la normale (P>97)";
      }
    }

    setPatientPoint({
      age: age,
      value: value,
    });
    setPercentile({
      value: calculatedPercentile,
      interpretation,
      color,
      ageData,
    });
  };

  const resetFields = () => {
    setPatientAge("");
    setPatientValue("");
    setPatientPoint(null);
    setPercentile(null);
  };

  const getUnitLabel = () => {
    switch (selectedCurve) {
      case "poids":
        return "kg";
      case "taille":
        return "cm";
      case "perimetre":
        return "cm";
      default:
        return "";
    }
  };

  const getCurveLabel = () => {
    switch (selectedCurve) {
      case "poids":
        return "Poids (kg)";
      case "taille":
        return "Taille (cm)";
      case "perimetre":
        return "Périmètre crânien (cm)";
      default:
        return "";
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label} mois</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)} {getUnitLabel()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <div className="w-8 h-8 flex items-center justify-center text-sm mr-3">
          <img src={babySvg} alt="Baby" className="text-[#54c2bc]" />
        </div>
        Courbes de Croissance OMS
      </h2>

      <div className="space-y-6">
        {/* Curve Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de courbe
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "poids", label: "Poids" },
              { key: "taille", label: "Taille" },
              { key: "perimetre", label: "Périmètre crânien" },
            ].map((curve) => (
              <button
                key={curve.key}
                onClick={() => {
                  setSelectedCurve(curve.key);
                  resetFields();
                }}
                className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedCurve === curve.key
                    ? "bg-[#54c2bc] text-white border-[#54c2bc]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {curve.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sexe
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setGender("F");
                resetFields();
              }}
              className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                gender === "F"
                  ? "bg-[#54c2bc] text-white border-[#54c2bc]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Fille
            </button>
            <button
              onClick={() => {
                setGender("M");
                resetFields();
              }}
              className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                gender === "M"
                  ? "bg-[#54c2bc] text-white border-[#54c2bc]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Garçon
            </button>
          </div>
        </div>

        {/* Patient Data Input */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-md font-semibold text-gray-900 mb-3">
            Ajouter une mesure
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Âge (mois)
              </label>
              <input
                type="number"
                step="0.5"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="Ex: 12"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Valeur ({getUnitLabel()})
              </label>
              <input
                type="number"
                step="0.1"
                value={patientValue}
                onChange={(e) => setPatientValue(e.target.value)}
                placeholder={`Ex: ${selectedCurve === "poids" ? "7.5" : "68"}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={calculatePercentile}
              disabled={!patientAge || !patientValue}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                patientAge && patientValue
                  ? "bg-[#54c2bc] text-white hover:bg-[#3BAAA4]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Calculer le percentile
            </button>
            <button
              onClick={resetFields}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Effacer
            </button>
          </div>
        </div>

        {/* Results */}
        {percentile && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
              Résultat
            </h4>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  P{percentile.value}
                </p>
                <p className={`text-sm font-medium ${percentile.color}`}>
                  {percentile.interpretation}
                </p>
              </div>
              <div className="text-right text-xs text-gray-600">
                <p>Âge: {patientAge} mois</p>
                <p>
                  Valeur: {patientValue} {getUnitLabel()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getCurrentData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="age"
                label={{
                  value: "Âge (mois)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: getCurveLabel(),
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {selectedCurve === "perimetre" ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="p3"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="P3"
                  />
                  <Line
                    type="monotone"
                    dataKey="p50"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                    name="P50"
                  />
                  <Line
                    type="monotone"
                    dataKey="p97"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="P97"
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="p3"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="P3"
                  />
                  <Line
                    type="monotone"
                    dataKey="p15"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                    name="P15"
                  />
                  <Line
                    type="monotone"
                    dataKey="p50"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                    name="P50"
                  />
                  <Line
                    type="monotone"
                    dataKey="p85"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                    name="P85"
                  />
                  <Line
                    type="monotone"
                    dataKey="p97"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="P97"
                  />
                </>
              )}

              {patientPoint && (
                <ReferenceLine
                  x={patientPoint.age}
                  stroke="#3b82f6"
                  strokeDasharray="5 5"
                  label={{
                    value: `Patient: ${patientPoint.value} ${getUnitLabel()}`,
                    position: "top",
                    fill: "#3b82f6",
                    fontSize: 12,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Info Message */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <span className="font-medium">Standards OMS:</span> Courbes de
            référence pour le suivi de la croissance des enfants de 0 à 24 mois.
            Les percentiles P3, P15, P50, P85 et P97 sont représentés.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GrowthCurve;
