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

  if (!formData.name.trim()) {
    newErrors.name = "Le nom du médicament est requis";
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
    const response = await deleteEntity("medicines", id);
    showToast(response.message, "success");
    fetchData();
    console.log("** Medicine deleted");
  } catch (error) {
    console.error("Error deleting medicine", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
    setDeletePopup({ show: false, id: null });
  }
};

export const fetchDocument = async (id, setFormData, setLoading) => {
  try {
    setLoading(true);
    const response = await findOneEntity("medicines", id);
    const medicine = response.data;

    console.log("Selected options:", response.data.payment);
    setFormData(response.data);
    console.log("** Medicine loaded");
  } catch (error) {
    console.error("Error fetching medicine:", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
};

export const handleSubmit = async (formData, setLoading, id, navigate) => {
  try {
    setLoading(true);

    const response = id
      ? await updateEntity("medicines", id, formData)
      : await createEntity("medicines", formData);
    showToast(response.message, "success");
    if (id) {
      console.log("** Medicine updated **");
    } else {
      console.log("** Medicine created **");
    }
    navigate("/dashboard/medicines");
  } catch (error) {
    console.error("Medicines submit error", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
};
