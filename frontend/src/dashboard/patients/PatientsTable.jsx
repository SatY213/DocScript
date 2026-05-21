import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import ConfirmDeletePopup from "../../common/deletePopup/ConfirmDeletePopup";
import { calculateAge, handleDelete } from ".";
import {
  handleExport,
  handleNextPage,
  handlePrevPage,
  handleSort,
} from "./tableIndex";

const PatientsTable = () => {
  // States
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortField, setSortField] = useState("nom");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletePopup, setDeletePopup] = useState({ show: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBirthDate, setSortBirthDate] = useState(1);
  const [sortLastName, setSortLastName] = useState(1);
  // Hooks
  const navigate = useNavigate();
  const {
    data: patients,
    loading,
    error,
    pagination,
    stats,
    refetch,
  } = useFetch(
    "/patients",
    searchQuery,
    currentPage,
    `sortBirthDate=${sortBirthDate}&sortLastName=${sortLastName}`,
  );
  //

  const MAX_PAGES_DISPLAYED = 5;
  const startPage = Math.max(
    1,
    currentPage - Math.floor(MAX_PAGES_DISPLAYED / 2),
  );
  const endPage = Math.min(
    pagination.totalPages,
    startPage + MAX_PAGES_DISPLAYED - 1,
  );
  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, pagination.totalItems || 0);

  const handleDeletePopup = (couponId) => {
    setDeletePopup({ show: true, id: couponId });
  };

  const handleAddPatient = () => {
    navigate("/dashboard/patients/create");
  };

  const SortIcon = () => {
    return <span className="ml-1 text-[10px]">↑↓</span>;
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {" "}
      {deletePopup.show && (
        <ConfirmDeletePopup
          itemName="Le patient"
          onConfirm={() =>
            handleDelete(
              deletePopup.id,
              setDeleteLoading,
              refetch,
              setDeletePopup,
            )
          }
          onCancel={() => setDeletePopup({ show: false, id: null })}
          isProcessing={loading}
        />
      )}{" "}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Géstion des patients
        </h1>
      </div>
      <div className="rounded-xl bg-white shadow-sm">
        {/* Header with actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Liste des patients
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Gérez et consultez les dossiers de vos patients{" "}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Rechercher un patient..."
                  value={searchQuery}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchQuery(e.target.value);
                  }}
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
              {/* Export Button */}
              <button
                onClick={() => handleExport(patients)}
                disabled={patients.length === 0}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exporter
              </button>

              {/* Add Patient Button */}
              <button
                onClick={handleAddPatient}
                className="flex items-center px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium"
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
                Ajouter Patient
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {patients.length > 0 ? (
            <>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        handleSort(
                          "lastName",
                          setSortLastName,
                          setSortBirthDate,
                        )
                      }
                    >
                      <div className="flex items-center">
                        Patient
                        <SortIcon />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        handleSort(
                          "birthDate",
                          setSortLastName,
                          setSortBirthDate,
                        )
                      }
                    >
                      <div className="flex items-center">
                        Âge
                        <SortIcon />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      // onClick={() => handleSort("derniereVisite")}
                    >
                      <div className="flex items-center">
                        Dernière visite
                        <SortIcon />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prochain RDV
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr
                      key={patient._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#54c2bc] rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-semibold">
                              {patient.personalInfo.firstName[0]}
                              {patient.personalInfo.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {patient.personalInfo.firstName}{" "}
                              {patient.personalInfo.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.personalInfo.sexe === "M"
                                ? "Homme"
                                : "Femme"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {calculateAge(patient.personalInfo.birthDate)} ans
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {patient.personalInfo.phone}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.personalInfo.email || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.personalInfo.prochainRdv
                          ? new Date(
                              patient.personalInfo.derniereVisite,
                            ).toLocaleDateString("fr-FR")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.personalInfo.prochainRdv
                          ? new Date(
                              patient.personalInfo.prochainRdv,
                            ).toLocaleDateString("fr-FR")
                          : "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-[#54c2bc] hover:text-[#3BAAA4] transition-colors"
                            onClick={() => {
                              window.scrollTo(0, 0);
                              navigate(
                                `/dashboard/patients/view/${patient._id}`,
                              );
                            }}
                          >
                            Voir
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            onClick={() => {
                              window.scrollTo(0, 0);
                              navigate(
                                `/dashboard/patients/update/${patient._id}`,
                              );
                            }}
                          >
                            Éditer
                          </button>
                          <button
                            onClick={() => handleDeletePopup(patient._id)}
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

              {/* Footer with pagination */}
              <div className="px-6 py-4  rounded-b-xl bg-white  border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between md:flex-row flex-col gap-4">
                  <div className="text-sm text-gray-700">
                    Affichage de{" "}
                    <span className="font-medium">{startItem}</span> à{" "}
                    <span className="font-medium">{endItem}</span> sur{" "}
                    <span className="font-medium">
                      {pagination.totalItems || 0}{" "}
                    </span>
                    patients
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handlePrevPage(setCurrentPage, currentPage)
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                      const pageNumber = startPage + i;
                      return (
                        <button
                          key={pageNumber}
                          className={`px-3 py-1 rounded-[2rem] text-sm font-medium transition-colors ${
                            currentPage === pageNumber
                              ? "bg-[#54c2bc] text-white shadow-sm"
                              : "text-gray-600 border border-gray-300 hover:border-[#54c2bc] hover:text-[#54c2bc] hover:bg-gray-50"
                          }`}
                          onClick={() => handlePageClick(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        handleNextPage(setCurrentPage, currentPage, pagination)
                      }
                      disabled={currentPage === pagination.totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : loading ? (
            <div className="text-center py-16">
              <div className="loader mx-auto"></div>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun patient trouvé
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "Aucun patient ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                  : "Vous n'avez pas encore de patients dans votre base de données."}
              </p>
              <button
                onClick={handleAddPatient}
                className="inline-flex items-center px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium"
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
                Ajouter votre premier patient
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientsTable;
