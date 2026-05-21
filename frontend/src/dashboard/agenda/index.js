import { api, createEntity, findOneEntity, updateEntity } from "../../api/api";
import { showToast } from "../../common/common";

export const handleAddAppointment = async (
  calculateEndTime,
  setShowAddAppointment,
  formData,
  selectedPatient,
  resetForm,
  submitLoading,
  refetch
) => {
  try {
    // Calculate end time
    const end_time = calculateEndTime(formData.start_time, formData.duration);

    const newAppointment = {
      ...formData,
      end_time,
      patient: selectedPatient
        ? {
            name: `${selectedPatient.personalInfo.firstName} ${selectedPatient.personalInfo.lastName}`,
          }
        : { name: "Patient" },
    };
    const response = await createEntity("appointments", newAppointment);
    showToast(response.message, "success");
    console.log("** Appointment created **");

    setShowAddAppointment(false);
    resetForm();
    refetch();
  } catch (error) {
    console.error("Appointment submit error", error);
    showToast(error.message, "error");
  } finally {
    submitLoading(false);
  }
};

// Submit Update
export const handleUpdateAppointment = async (
  id,
  calculateEndTime,
  setShowAddAppointment,
  formData,
  selectedPatient,
  resetForm,
  submitLoading,
  refetch
) => {
  try {
    // Calculate end time
    const end_time = calculateEndTime(formData.start_time, formData.duration);

    const updatedAppointment = {
      ...formData,
      end_time,
      patient: selectedPatient
        ? {
            name: `${selectedPatient.personalInfo.firstName} ${selectedPatient.personalInfo.lastName}`,
          }
        : { name: "Patient" },
    };

    const response = await updateEntity("appointments", id, updatedAppointment);
    showToast(response.message, "success");
    console.log("** Appointment created **");

    setShowAddAppointment(false);
    resetForm();
    refetch();
  } catch (error) {
    console.error("Appointment submit error", error);
    showToast(error.message, "error");
  } finally {
    submitLoading(false);
  }
};

// Fetch day's appointments
export const fetchDayAppointments = async (
  setTodayAppointments,
  selectedDate
) => {
  try {
    const response = await findOneEntity(
      `appointments/date-day`,
      selectedDate.toISOString().split("T")[0]
    );
    setTodayAppointments(response.data || []);
  } catch (err) {
    console.error(err);
    showToast(err.message, "error");

    setTodayAppointments([]);
  }
};

// Fetch week's appointments

export const fetchWeekAppointments = async (
  setWeekAppointments,
  selectedDate
) => {
  try {
    const response = await findOneEntity(
      `appointments/date-week`,
      selectedDate.toISOString().split("T")[0]
    );
    setWeekAppointments(response.data || []);
  } catch (err) {
    console.error(err);
    showToast(err.message, "error");

    setWeekAppointments([]);
  }
};
// Fetch next 7 days appointments
export const fetchNext7DayAppointments = async (
  setNext7DayAppointments,
  setNext7Loading
) => {
  try {
    setNext7Loading(true);
    const response = await api.get(`appointments/next7days`);
    setNext7DayAppointments(response.data.data || []);
    console.log("Next 7 days appointments fetched");
  } catch (error) {
    console.error("Error fetching next 7 days appointments:", error);
    showToast(
      error?.response?.data?.message ||
        `Failed to get next 7 days appointments.`,
      "error"
    );
  } finally {
    setNext7Loading(false);
  }
};
