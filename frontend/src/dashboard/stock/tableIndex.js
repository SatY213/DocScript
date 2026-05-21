export const handlePrevPage = (setCurrentPage, currentPage) => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

export const handleNextPage = (setCurrentPage, currentPage, pagination) => {
  if (currentPage < pagination.totalPages) {
    setCurrentPage(currentPage + 1);
  }
};
export const handleSort = (field, setSortName, setSortQuantity) => {
  if (field === "quantity") {
    setSortName(""); // reset the other sorter

    setSortQuantity((prev) => {
      if (prev == "-1") return "1";
      if (prev == "1") return "-1";
      return "-1";
    });
  } else if (field == "name") {
    setSortQuantity("");

    setSortName((prev) => {
      if (prev == "-1") return "1";
      if (prev == "1") return "-1";
      return "-1";
    });
  }
};
