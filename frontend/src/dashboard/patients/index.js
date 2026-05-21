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

  // Required fields validation - Only personal info required fields
  if (!formData.personalInfo.firstName.trim())
    newErrors["personalInfo.firstName"] = "Le prénom est requis";
  if (!formData.personalInfo.lastName.trim())
    newErrors["personalInfo.lastName"] = "Le nom est requis";
  if (!formData.personalInfo.birthDate)
    newErrors["personalInfo.birthDate"] = "La date de naissance est requise";
  if (!formData.personalInfo.sexe)
    newErrors["personalInfo.sexe"] = "Le sexe est requis";
  if (!formData.personalInfo.phone.trim())
    newErrors["personalInfo.phone"] = "Le numéro de téléphone est requis";
  if (!formData.personalInfo.email.trim())
    newErrors["personalInfo.email"] = "L'email est requis";

  // Email format validation
  if (
    formData.personalInfo.email &&
    !/\S+@\S+\.\S+/.test(formData.personalInfo.email)
  ) {
    newErrors["personalInfo.email"] = "Format d'email invalide";
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
    const response = await deleteEntity("patients", id);
    showToast(response.message, "success");
    fetchData();
    console.log("** Patient deleted");
  } catch (error) {
    console.error("Error deleting patient", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
    setDeletePopup({ show: false, id: null });
  }
};

export const fetchDocument = async (id, setFormData, setLoading) => {
  try {
    setLoading(true);
    const response = await findOneEntity("patients", id);
    const patient = response.data;

    console.log("Selected options:", response.data.payment);
    setFormData(response.data);
    console.log("** Patient loaded");
  } catch (error) {
    console.error("Error fetching patient:", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
};

export const handleSubmit = async (formData, setLoading, id, navigate) => {
  try {
    setLoading(true);

    const response = id
      ? await updateEntity("patients", id, formData)
      : await createEntity("patients", formData);
    showToast(response.message, "success");
    if (id) {
      console.log("** Patient updated **");
    } else {
      console.log("** Patient created **");
    }

    navigate("/dashboard/patients");
  } catch (error) {
    console.error("Patients submit error", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
};
