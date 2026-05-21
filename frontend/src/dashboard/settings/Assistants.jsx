import React, { useState } from "react";

function Assistants({
  assistants,
  setShowAddAssistant,
  handleDeleteAssistant,
  handleToggleAssistantStatus,
  formatDate,
}) {
  const [assistantSearch, setAssistantSearch] = useState("");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Assistants Médicaux
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {assistants.length} assistant(s) au total
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher un assistant..."
                value={assistantSearch}
                onChange={(e) => setAssistantSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={() => setShowAddAssistant(true)}
              className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nouvel Assistant
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {assistants.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assistant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autorisations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'ajout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assistants.slice(0, 10).map((assistant) => (
                <tr
                  key={assistant.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {assistant.fullName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assistant.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {assistant.permissions
                        .filter((perm) => perm.canView) // Only show permissions with view access
                        .map((perm) => {
                          // Get abbreviation for display
                          const getAbbreviation = (route) => {
                            switch (route) {
                              case "patients":
                                return "Patients";
                              case "appointments":
                                return "RDV";
                              case "prescriptions":
                                return "Ordonnances";
                              case "billing":
                                return "Facturation";
                              case "invoices":
                                return "Factures";
                              case "stock":
                                return "Stock";
                              case "settings":
                                return "Paramètres";
                              default:
                                return route;
                            }
                          };

                          const displayText = getAbbreviation(perm.route);

                          return (
                            <span
                              key={perm.route}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                perm.canEdit
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                              title={`${displayText}: ${
                                perm.canEdit
                                  ? "Lecture et Écriture"
                                  : "Lecture seulement"
                              }`}
                            >
                              {displayText}
                            </span>
                          );
                        })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        assistant.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {assistant.status === "active" ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(assistant.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleToggleAssistantStatus(assistant.id)
                        }
                        className="text-[#54c2bc] hover:text-[#3BAAA4] transition-colors"
                      >
                        {assistant.status === "active"
                          ? "Désactiver"
                          : "Activer"}
                      </button>
                      <button
                        onClick={() => handleDeleteAssistant(assistant.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-500 mb-4">Aucun assistant pour le moment</p>
            <button
              onClick={() => setShowAddAssistant(true)}
              className="mt-4 px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm"
            >
              Ajouter votre premier assistant
            </button>
          </div>
        )}
      </div>

      {/* Footer with pagination if needed */}
      {assistants.length > 10 && (
        <div className="px-6 py-4 rounded-b-xl bg-white border-t border-gray-200">
          <div className="flex items-center justify-between md:flex-row flex-col gap-4">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à{" "}
              <span className="font-medium">10</span> sur{" "}
              <span className="font-medium">{assistants.length}</span>{" "}
              assistants
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Précédent
              </button>
              <button className="px-3 py-1 rounded-[2rem] text-sm font-medium bg-[#54c2bc] text-white shadow-sm">
                1
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assistants;
