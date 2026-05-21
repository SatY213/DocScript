import { api } from "../../api/api";
import { showToast } from "../../common/common";

export const handleAddAssistant = async (
  formData,
  setLoading,
  setShowAddAssistant,
  reset
) => {
  try {
    setLoading(true);
    const response = await api.post("assistants/add", formData);
    console.log("** Assistant added **");
    showToast(response.data.message, "success");
    setShowAddAssistant(false);
    reset();
  } catch (error) {
    console.error("Error getting user info:", error);
    console.log("error", error);
    showToast(error.response.data.message, "error");
  } finally {
    // Any cleanup actions if necessary    setLoading(false);
    setLoading(false);
  }
};
