import { api } from "../../api/api";
import { showToast } from "../../common/common";

export const handleLogin = async (formData, setLoading) => {
  try {
    setLoading(true);
    const response = await api.post("/auth/login", formData);
    console.log("Login successful:", response.data);
    showToast(response.data.message, "success");
    window.location.href = "/dashboard/patients";
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error.response?.data?.message || "Une erreur s'est produite.";
    showToast(errorMessage, "error");
  } finally {
    setLoading(false);
  }
};

export const handleRegister = async (formData, setLoading) => {
  try {
    setLoading(true);
    const response = await api.post("/auth/register", formData);
    console.log("Registration successful:", response.data);
    showToast(response.data.message, "success");
    window.location.href = "/dashboard/patients";
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage =
      error.response?.data?.message || "Une erreur s'est produite.";
    showToast(errorMessage, "error");
  } finally {
    setLoading(false);
  }
};

export const handleLogout = async () => {
  try {
    const response = await api.post(
      "/auth/logout",
      {},
      { withCredentials: true }
    );
    console.log("Logout successful:", response.data);
    showToast(response.data.message, "success");
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout error:", error);
    const errorMessage =
      error.response?.data?.message || "Une erreur s'est produite.";
    showToast(errorMessage, "error");
  }
};
