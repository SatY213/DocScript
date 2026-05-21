import {
  createEntity,
  deleteEntity,
  findOneEntity,
  updateEntity,
} from "../../api/api";
import { showToast } from "../../common/common";
export const calculateAge = (birthDate) => {
  if (!birthDate) return "";
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const validateForm = (formData, setErrors) => {
  const newErrors = {};

  // Validate patient selection
  if (!formData.patient_ref) {
    newErrors.patient_ref = "Veuillez sélectionner un patient";
  }

  // Validate at least one prescription is prescribed
  if (
    !formData.presribedprescriptions ||
    formData.presribedprescriptions.length === 0
  ) {
    newErrors.presribedprescriptions =
      "Veuillez ajouter au moins un médicament";
  }

  // Validate each prescription is not empty
  if (
    formData.presribedprescriptions &&
    formData.presribedprescriptions.length > 0
  ) {
    formData.presribedprescriptions.forEach((prescription, index) => {
      if (!prescription.trim()) {
        newErrors[`prescription_${index}`] =
          "Le nom du médicament ne peut pas être vide";
      }
    });
  }

  // Validate note length (optional, but if provided, limit length)
  if (formData.note && formData.note.length > 1000) {
    newErrors.note = "La note ne peut pas dépasser 1000 caractères";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
export const handleDelete = async (
  id,
  setLoading,
  fetchData,
  setDeletePopup
) => {
  try {
    setLoading(true);
    const response = await deleteEntity("prescriptions", id);
    showToast(response.message, "success");
    fetchData();
    console.log("** prescription deleted");
  } catch (error) {
    console.error("Error deleting prescription", error);
    showToast(`Echec de la suppression de la prescription`, "error");
  } finally {
    setLoading(false);
    setDeletePopup({ show: false, id: null });
  }
};

export const fetchDocument = async (
  id,
  setFormData,
  setSelectedPatient,
  setLoading
) => {
  try {
    setLoading(true);
    const response = await findOneEntity("prescriptions", id);
    const prescription = response.data;

    console.log("Selected options:", response.data.payment);
    setFormData(response.data);
    setSelectedPatient(response.data.patient_ref);

    console.log("** prescription loaded");
  } catch (error) {
    console.error("Error fetching prescription:", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
};

export const handleSubmit = async (formData, setLoading, id, navigate) => {
  try {
    setLoading(true);

    const response = id
      ? await updateEntity("prescriptions", id, formData)
      : await createEntity("prescriptions", formData);
    showToast(response.message, "success");
    if (id) {
      console.log("** prescription updated **");
    } else {
      console.log("** prescription created **");
    }
    navigate("/dashboard/prescriptions");
  } catch (error) {
    console.error("prescriptions submit error", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
};
export const handlePrint = (prescription, patient, doctorInfo = null) => {
  const defaultDoctorInfo = {
    name: "Dr. Jean Dupont",
    specialty: "Médecin Généraliste",
    address: "123 Avenue des Médecins, 75001 Paris",
    phone: "01 23 45 67 89",
    rpps: "12345678901",
  };
  console.log(patient);
  const doctor = doctorInfo || defaultDoctorInfo;

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const printWindow = window.open("", "_blank", "width=1000,height=800");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <title>Ordonnance Médicale ${patient.personalInfo.firstName} ${
    patient.personalInfo.lastName
  }</title>

      <style>
        @page {
          size: A4;
          margin: 8mm;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Inter", sans-serif;
        }

        .content {
          width: 700px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 25px;
          padding: 20px;
          position: relative;
          min-height: 100%;
        }

        .header {
          display: flex;
          justify-content: space-between;
        }

        .header .left_section h3,
        .right_section h3 {
          font-size: 16px;
        }

        .header .left_section p,
        .right_section p {
          font-size: 13px;
        }

        .body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .prescribed_medicines {
          min-height: 200px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .medicine {
          display: flex;
          flex-direction: column;
          font-size: 15px;
          font-weight: 500;
        }

        .medicine span {
          font-size: 13px;
          font-weight: 400;
        }

        .doctor_note {
          min-height: 160px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .doctor_note h3 {
          font-size: 16px;
        }

        .doctor_note p {
          font-size: 13px;
        }

        .footer {
     
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;
          padding-top:40px;
        }

        .footer .date {
          font-size: 13px;
          font-weight: 600;
        }

        .footer .signature {
          align-self: flex-end;
          font-size: 14px;
          font-weight: 600;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>

    <body>
      <div class="content">
        <div class="header">
          <div class="left_section">
            <h3>${doctor.name}</h3>
            <p>${doctor.specialty}</p>
            <p>${doctor.address}</p>
            <p>Tél : ${doctor.phone}</p>
            <p>${doctor.rpps}</p>
          </div>

          <div class="right_section">
            <h3>Patient :</h3>
            <p>${patient.personalInfo.firstName} ${
    patient.personalInfo.lastName
  }</p>
            <p>Né(e) le : ${new Date(
              patient.personalInfo.birthDate
            ).toLocaleDateString("fr-FR")}</p>
            <p>Age : ${calculateAge(patient.personalInfo.birthDate)} ans</p>
            <p>Poids : ${patient?.medicalInfo?.weight || "-"} kg</p>
            <p>Taille : ${patient?.medicalInfo?.height || "-"} cm</p>
          </div>
        </div>

        <div class="body">
      <div class="prescribed_medicines">
  ${prescription.presribedMedicines
    .map(
      (m, i) => `
      <p class="medicine">
        ${i + 1}. ${m.medicine}
        ${m.instructions ? `<span>${m.instructions}</span>` : ""}
      </p>
    `
    )
    .join("")}
</div>


          ${
            prescription.note
              ? `
              <div class="doctor_note">
                <h3>Notes du médecin</h3>
                <p>${prescription.note.replace(/\n/g, "<br>")}</p>
              </div>
            `
              : ""
          }
        </div>

        <div class="footer">
          <div class="date">Fait le ${formattedDate}</div>
          <div class="signature">Cachet et signature du médecin</div>
        </div>
      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
            window.close();
          }, 300);
        };
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
};
