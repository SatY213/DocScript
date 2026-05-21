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

export const handleExport = (medicines) => {
  // Simulate export functionality
  const csvContent = [
    ["Nom", "Classe therapeutique", "dosage", "formes", "note"],
    ...medicines.map((medicine) => [
      medicine.name || "",
      medicine.therapeuticClass || "",
      medicine.dosage || "",
      medicine.shapes || "",
      medicine.note || "",
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "médicaments.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};

export const handleSort = (field, setSortName, setSortDosage) => {
  if (field === "dosage") {
    setSortName(""); // reset the other sorter

    setSortDosage((prev) => {
      if (prev == "-1") return "1";
      if (prev == "1") return "-1";
      return "-1";
    });
  } else if (field == "name") {
    setSortDosage("");

    setSortName((prev) => {
      if (prev == "-1") return "1";
      if (prev == "1") return "-1";
      return "-1";
    });
  }
};
