import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { wilayas } from "./data";
import DoctorInfo from "./DoctorInfo";
import { getUserInfo } from ".";
import Assitants from "./Assistants";
import AssistantForm from "./AssistantForm";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("doctor");
  const [assistants, setAssistants] = useState([]);
  const [showAddAssistant, setShowAddAssistant] = useState(false);
  const [assistantForm, setAssistantForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    authorisations: {
      route: "",
      canView: false,
      canEdit: false,
    },
  });
  const [doctorForm, setDoctorForm] = useState({
    picture: "",
    fullName: "",
    speciality: "",
    wilaya: "",
    address: "",
    phone: "",
    cnom: "",
    nif: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Fetch and set doctor info here using getUserInfo
    getUserInfo(setDoctorForm, setAssistants, setLoading);
  }, []);
  const handleDeleteAssistant = (assistantId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet assistant ?")) {
      setAssistants((prev) => prev.filter((a) => a.id !== assistantId));
    }
  };

  const handleToggleAssistantStatus = (assistantId) => {
    setAssistants((prev) =>
      prev.map((assistant) => {
        if (assistant.id === assistantId) {
          return {
            ...assistant,
            status: assistant.status === "active" ? "inactive" : "active",
          };
        }
        return assistant;
      })
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">
          Gérez vos informations professionnelles et vos assistants
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("doctor")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "doctor"
                ? "border-[#54c2bc] text-[#54c2bc]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Informations du Médecin
          </button>
          <button
            onClick={() => setActiveTab("assistants")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "assistants"
                ? "border-[#54c2bc] text-[#54c2bc]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Assistants ({assistants.length})
          </button>
        </nav>
      </div>

      {/* Doctor Information Tab */}
      {activeTab === "doctor" && (
        <DoctorInfo
          doctorForm={doctorForm}
          loading={loading}
          errors={errors}
          setDoctorForm={setDoctorForm}
          setLoading={setLoading}
          setErrors={setErrors}
        />
      )}

      {/* Assistants Tab */}
      {activeTab === "assistants" && (
        <Assitants
          assistants={assistants}
          setShowAddAssistant={setShowAddAssistant}
          handleDeleteAssistant={handleDeleteAssistant}
          handleToggleAssistantStatus={handleToggleAssistantStatus}
          formatDate={formatDate}
        />
      )}

      {/* Add Assistant Modal */}
      {showAddAssistant && (
        <AssistantForm setShowAddAssistant={setShowAddAssistant} />
      )}
    </div>
  );
};

export default Settings;
