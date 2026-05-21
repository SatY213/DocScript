import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {
  fetchDayAppointments,
  fetchNext7DayAppointments,
  fetchWeekAppointments,
  handleAddAppointment,
  handleUpdateAppointment,
} from ".";
import { api, findOneEntity } from "../../api/api";
import { showToast } from "../../common/common";
import { durationOptions, statusOptions, timeSlots } from "./data";
import {
  calculateEndTime,
  formatDate,
  formatTime,
  formatWeekRange,
  getAppointmentsForTimeSlot,
  getWeekDates,
} from "./helper";
import Daily from "./Daily";
import Weekly from "./Weekly";

const Agenda = () => {
  const [view, setView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showEditAppointment, setShowEditAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [next7DayAppointments, setNext7DayAppointments] = useState([]);
  const [weekAppointments, setWeekAppointments] = useState([]);
  const [next7Loading, setNext7Loading] = useState(false);
  const [formData, setFormData] = useState({
    patient_ref: "",
    title: "",
    date: new Date().toISOString().split("T")[0],
    start_time: "09:00",
    duration: "30",
    status: "scheduled",
  });

  useEffect(() => {
    fetchNext7DayAppointments(setNext7DayAppointments, setNext7Loading);
  }, []);

  const navigate = useNavigate();
  // Data fetching
  const { data: patients = [], loading: patientsLoading } = useFetch(
    "/patients",
    searchTerm,
    ""
  );
  const {
    data: appointments = [],
    stats: stats,
    refetch: refetchAppointments,
  } = useFetch("/appointments/stats", appointmentSearch, 1);
  // --------------------------------------------------
  useEffect(() => {
    if (view === "week") {
      fetchWeekAppointments(setWeekAppointments, selectedDate);
    } else if (view === "day") {
      fetchDayAppointments(setTodayAppointments, selectedDate);
    }
  }, [selectedDate, view, stats]);
  // Format date

  // Navigation
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Week Navigation
  const onPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };
  const onNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };
  const onGoToToday = () => {
    setSelectedDate(new Date());
  };

  // Handle appointment selection
  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditAppointment(true);
    setFormData({
      ...appointment,
      date: appointment.date.split("T")[0],
      start_time: appointment.start_time.slice(0, 5),
    });
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({
      ...prev,
      patient_ref: patient._id,
      title: `Consultation - ${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`,
    }));
  };

  const resetForm = () => {
    setFormData({
      patient_ref: "",
      title: "",
      date: new Date().toISOString().split("T")[0],
      start_time: "09:00",
      duration: "30",
      status: "scheduled",
    });
    setSelectedPatient(null);
    setSelectedAppointment(null);
    setSearchTerm("");
  };

  const weekDates = getWeekDates(selectedDate || new Date());
  const refetch = () => {
    refetchAppointments();
    fetchNext7DayAppointments(setNext7DayAppointments, setNext7Loading);
  };
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
              Agenda Médical
            </h1>
            <p className="text-gray-600">
              Gérez vos rendez-vous et votre emploi du temps
            </p>
          </div>

          <button
            onClick={() => setShowAddAppointment(true)}
            className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm font-medium flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouveau Rendez-vous
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          <div className="text-sm text-gray-500">Aujourd'hui</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-[#54c2bc]">
            {stats.scheduled}
          </div>
          <div className="text-sm text-gray-500">Programmé</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {stats.confirmed}
          </div>
          <div className="text-sm text-gray-500">Confirmé</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {stats.cancelled}
          </div>
          <div className="text-sm text-gray-500">Annulé</div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200 ">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Date Navigation */}
            {view === "day" && (
              <div className="flex items-center space-x-4  flex-col lg:flex-row  space-y-4">
                <button
                  onClick={goToPreviousDay}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {formatDate(selectedDate)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {todayAppointments?.length} rendez-vous
                  </p>
                </div>

                <button
                  onClick={goToNextDay}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Aujourd'hui
                </button>
              </div>
            )}
            {view === "week" && (
              <div className="flex items-center space-x-4  flex-col lg:flex-row  space-y-4">
                <button
                  onClick={onPreviousWeek}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Semaine précédente"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {formatWeekRange(weekDates)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Semaine{" "}
                    {Math.ceil(
                      (selectedDate.getDate() +
                        new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth(),
                          1
                        ).getDay()) /
                        7
                    )}
                  </p>
                </div>

                <button
                  onClick={onNextWeek}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Semaine suivante"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={onGoToToday}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cette semaine
                  </button>
                </div>
              </div>
            )}
            {/* View Toggle and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView("day")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    view === "day"
                      ? "bg-white shadow-sm text-[#54c2bc]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Jour
                </button>
                <button
                  onClick={() => setView("week")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    view === "week"
                      ? "bg-white shadow-sm text-[#54c2bc]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Semaine
                </button>
              </div>
              {/* Adding status filter later */}
              {/* <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
              >
                <option value="all">Tous les statuts</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
        </div>
        {view === "week" ? (
          <Weekly
            appointments={weekAppointments || []}
            handleAppointmentSelect={handleAppointmentSelect}
            selectedDate={selectedDate}
          />
        ) : (
          <Daily
            todayAppointments={todayAppointments || []}
            handleAppointmentSelect={handleAppointmentSelect}
          />
        )}
      </div>

      {/* Upcoming Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Rendez-vous à venir
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Prochains rendez-vous des 7 prochains jours
          </p>
        </div>

        <div className="p-6">
          {next7DayAppointments.length > 0 ? (
            <div className="space-y-4">
              {next7DayAppointments.map((appointment) => {
                const status = statusOptions.find(
                  (s) => s.value === appointment.status
                );
                return (
                  <div
                    key={appointment._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleAppointmentSelect(appointment)}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${status?.color}15` }}
                      >
                        <svg
                          className="w-6 h-6"
                          style={{ color: status?.color }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(appointment.date)} •{" "}
                          {calculateEndTime(
                            appointment.start_time,
                            appointment.duration
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patient_ref.personalInfo?.firstName +
                            " " +
                            appointment.patient_ref.personalInfo?.lastName ||
                            "Patient"}{" "}
                          • {appointment.duration} minutes
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${status?.color}20`,
                          color: status?.color,
                        }}
                      >
                        {status?.label}
                      </span>

                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleDeletePopup(article._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun rendez-vous à venir</p>
              <button
                onClick={() => setShowAddAppointment(true)}
                className="mt-4 px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm"
              >
                Planifier un rendez-vous
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Appointment Modal */}
      {(showAddAppointment || showEditAppointment) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {showEditAppointment
                  ? "Modifier le Rendez-vous"
                  : "Nouveau Rendez-vous"}
              </h3>
              <button
                onClick={() => {
                  setShowAddAppointment(false);
                  setShowEditAppointment(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                showEditAppointment
                  ? (e) => {
                      e.preventDefault();
                      handleUpdateAppointment(
                        selectedAppointment._id,
                        calculateEndTime,
                        setShowEditAppointment,
                        formData,
                        resetForm,
                        submitLoading,
                        refetch
                      );
                    }
                  : (e) => {
                      e.preventDefault();
                      handleAddAppointment(
                        calculateEndTime,
                        setShowAddAppointment,
                        formData,
                        selectedPatient,
                        resetForm,
                        submitLoading,
                        refetch
                      );
                    }
              }
            >
              <div className="space-y-4">
                {/* Patient Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient <span className="text-red-600">*</span>
                  </label>
                  <div className="relative ">
                    <input
                      type="text"
                      placeholder="Rechercher un patient..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    />
                    {searchTerm && patients.length > 0 && (
                      <div className="absolute left-0 right-0 z-50 mt-1 border border-gray-200 rounded-lg bg-white shadow-lg max-h-40 overflow-y-auto">
                        {" "}
                        {patients.map((patient) => (
                          <div
                            key={patient._id}
                            onClick={() => {
                              handlePatientSelect(patient);
                              setSearchTerm("");
                            }}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-sm">
                              {patient.personalInfo.firstName}{" "}
                              {patient.personalInfo.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {patient.personalInfo.phone}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}{" "}
                  </div>
                </div>

                {selectedPatient && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Patient sélectionné:{" "}
                      {selectedPatient.personalInfo.firstName}{" "}
                      {selectedPatient.personalInfo.lastName}
                    </p>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  />
                </div>

                {/* Time and Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de début <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="start_time"
                      value={formData.start_time}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          start_time: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    >
                      {durationOptions.map((duration) => (
                        <option key={duration.value} value={duration.value}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Motif de la visite */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motif de la visite <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                    placeholder="Ex: Consultation de contrôle, Vaccination, Suivi..."
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#54c2bc] focus:border-transparent text-sm"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calculated End Time Display */}
                {formData.start_time && formData.duration && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Heure de fin:</span>{" "}
                      {calculateEndTime(formData.start_time, formData.duration)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                {showEditAppointment && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Voulez-vous vraiment supprimer ce rendez-vous ?"
                        )
                      ) {
                        handleDeleteAppointment(selectedAppointment._id);
                        setShowEditAppointment(false);
                        resetForm();
                      }
                    }}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    Supprimer
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowAddAppointment(false);
                    setShowEditAppointment(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#54c2bc] text-white rounded-lg hover:bg-[#3BAAA4] transition-colors text-sm"
                >
                  {showEditAppointment ? "Mettre à jour" : "Créer Rendez-vous"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
