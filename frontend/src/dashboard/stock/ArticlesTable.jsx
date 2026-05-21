import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import ConfirmDeletePopup from "../../common/deletePopup/ConfirmDeletePopup";
import { handleNextPage, handlePrevPage, handleSort } from "./tableIndex";
import { handleDelete } from ".";

const ArticlesTable = () => {
  // States
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortField, setSortField] = useState("nom");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletePopup, setDeletePopup] = useState({ show: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortQuantity, setSortQuantity] = useState(1);
  const [sortName, setSortName] = useState(1);

  // Hooks
  const navigate = useNavigate();
  const {
    data: articles,
    loading,
    error,
    pagination,
    stats,
    refetch,
  } = useFetch(
    "/articles",
    searchQuery,
    currentPage,
    `sortName=${sortName}&sortQuantity=${sortQuantity}`,
  );

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

  const handleDeletePopup = (articleId) => {
    setDeletePopup({ show: true, id: articleId });
  };

  const handleAddArticle = () => {
    navigate("/dashboard/stock/articles/create");
  };

  const SortIcon = () => {
    return <span className="ml-1 text-[10px]">↑↓</span>;
  };

  const getStockStatus = (quantity, lowQuantity) => {
    if (quantity <= lowQuantity) {
      return {
        text: "Stock faible",
        color: "red",
        badgeClass: "bg-red-100 text-red-800",
      };
    } else if (quantity <= lowQuantity * 2) {
      return {
        text: "Stock moyen",
        color: "yellow",
        badgeClass: "bg-yellow-100 text-yellow-800",
      };
    } else {
      return {
        text: "Stock bon",
        color: "green",
        badgeClass: "bg-green-100 text-green-800",
      };
    }
  };

  const formatQuantity = (quantity) => {
    return Number.isInteger(quantity) ? quantity : quantity.toFixed(2);
  };

  return (
    <>
      {deletePopup.show && (
        <ConfirmDeletePopup
          itemName="L'article"
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
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Gestion de stock
        </h1>
      </div>
      <div className="rounded-xl bg-white shadow-sm">
        {/* Header with actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Liste d'articles
              </h2>{" "}
              <p className="text-sm text-gray-600 mt-1">
                Gérez et suivez votre inventaire d'articles{" "}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Rechercher un article..."
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

              {/* Add Article Button */}
              <button
                onClick={handleAddArticle}
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
                Ajouter Article
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {articles.length > 0 ? (
            <>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        handleSort("name", setSortName, setSortQuantity)
                      }
                    >
                      <div className="flex items-center">
                        Nom de l'article
                        <SortIcon />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        handleSort("quantity", setSortName, setSortQuantity)
                      }
                    >
                      <div className="flex items-center">
                        Quantité
                        <SortIcon />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seuil bas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => {
                    const stockStatus = getStockStatus(
                      article.quantity,
                      article.lowQuantity,
                    );

                    return (
                      <tr
                        key={article._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
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
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {article.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatQuantity(article?.quantity)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {article.unit || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatQuantity(article.lowQuantity || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.badgeClass}`}
                          >
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-gray-600 hover:text-gray-800 transition-colors"
                              onClick={() => {
                                window.scrollTo(0, 0);
                                navigate(
                                  `/dashboard/stock/articles/update/${article._id}`,
                                );
                              }}
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDeletePopup(article._id)}
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
                    );
                  })}
                </tbody>
              </table>

              {/* Footer with pagination */}
              <div className="px-6 py-4 rounded-b-xl bg-white border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between md:flex-row flex-col gap-4">
                  <div className="text-sm text-gray-700">
                    Affichage de{" "}
                    <span className="font-medium">{startItem}</span> à{" "}
                    <span className="font-medium">{endItem}</span> sur{" "}
                    <span className="font-medium">
                      {pagination.totalItems || 0}{" "}
                    </span>
                    articles
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
                          onClick={() => setCurrentPage(pageNumber)}
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
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#54c2bc] border-t-transparent mx-auto"></div>
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "Aucun article ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                  : "Vous n'avez pas encore d'articles dans votre inventaire."}
              </p>
              <button
                onClick={handleAddArticle}
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
                Ajouter votre premier article
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticlesTable;
