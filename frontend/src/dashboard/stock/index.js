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
    newErrors.name = "Le nom de l'article est requis";
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
    const response = await deleteEntity("articles", id);
    showToast(response.message, "success");
    fetchData();
    console.log("** Article deleted");
  } catch (error) {
    console.error("Error deleting article", error);
    showToast(`Echec de la suppression de l'article`, "error");
  } finally {
    setLoading(false);
    setDeletePopup({ show: false, id: null });
  }
};

export const fetchDocument = async (id, setFormData, setLoading) => {
  try {
    setLoading(true);
    const response = await findOneEntity("articles", id);
    const article = response.data;

    console.log("Selected options:", response.data.payment);
    setFormData(response.data);
    console.log("** Article loaded");
  } catch (error) {
    console.error("Error fetching article:", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
};

export const handleSubmit = async (formData, setLoading, id, navigate) => {
  try {
    setLoading(true);

    const response = id
      ? await updateEntity("articles", id, formData)
      : await createEntity("articles", formData);
    showToast(response.message, "success");
    if (id) {
      console.log("** Article updated **");
    } else {
      console.log("** Article created **");
    }
    navigate("/dashboard/stock");
  } catch (error) {
    console.error("Articles submit error", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
};
