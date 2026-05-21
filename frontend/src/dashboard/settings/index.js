import {
  api,
  createEntity,
  deleteEntity,
  findOneEntity,
  updateEntity,
} from "../../api/api";
import { showToast } from "../../common/common";
// Handle save doctor info

export const getUserInfo = async (setDoctorForm, setLoading) => {
  try {
    setLoading(true);
    const response = await api.get(`/settings/info`);
    const user = response.data;
    setDoctorForm(user.data || {});
    console.log(user.data);
  } catch (error) {
    console.error("Error getting user info:", error);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
};

export const handleSaveDoctorInfo = async (
  setDoctorForm,
  doctorForm,
  setLoading,
  setErrors,
) => {
  try {
    setLoading(true);

    const formData = new FormData();

    // Append normal fields
    Object.entries(doctorForm).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (key === "new_picture") return;

      if (key === "pictureFile" && value instanceof File) {
        formData.append("pictureFile", value);
        return;
      }

      // Default fields
      if (key !== "pictureFile") {
        formData.append(key, value);
      }
    });

    const response = await api.patch(`/settings/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const user = response.data;
    showToast(response.data.message, "success");
    return user.data;
  } catch (error) {
    console.error("Error updating user:", error);
    showToast(error.response?.data?.message || "Erreur", "error");
  } finally {
    setLoading(false);
  }
};
