import { calculateAge } from ".";

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

export const handleExport = (patients) => {
  // Simulate export functionality
  const csvContent = [
    [
      "Nom",
      "Prénom",
      "Âge",
      "Genre",
      "Téléphone",
      "Email",
      "Dernière visite",
      "Prochain RDV",
    ],
    ...patients.map((patient) => [
      patient.personalInfo.lastName || "",
      patient.personalInfo.firstName || "",
      calculateAge(patient.personalInfo.birthDate) || "",
      patient.personalInfo.sexe || "",
      patient.personalInfo.phone || "",
      patient.personalInfo.email || "",
      patient.personalInfo.derniereVisite || "",
      patient.personalInfo.prochainRdv || "",
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const BOM = "\uFEFF";

  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "patients.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};

export const handleSort = (field, setSortLastName, setSortBirthDate) => {
  if (field === "birthDate") {
    setSortLastName(""); // reset the other sorter

    setSortBirthDate((prev) => {
      if (prev == "-1") return "1";
      if (prev == "1") return "-1";
      return "1";
    });
  } else if (field == "lastName") {
    setSortBirthDate(""); // reset the other sorter

    setSortLastName((prev) => {
      if (prev == "-1") return "1";
      if (prev == "1") return "-1";
      return "1";
    });
  }
};
