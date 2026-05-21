import React from "react";
import {
  calculateEndTime,
  formatDate,
  formatTime,
  getAppointmentsForTimeSlot,
  getWeekDates,
} from "./helper";
import { statusOptions, timeSlots } from "./data";

function Weekly({ appointments, handleAppointmentSelect, selectedDate }) {
  // Get all 7 days of the week starting from Monday
  const weekDates = getWeekDates(selectedDate);

  // Helper to get appointments for a specific time slot with staggering
  const getStaggeredAppointments = (timeSlot, dayAppointments) => {
    const slotAppointments = getAppointmentsForTimeSlot(
      timeSlot,
      dayAppointments
    );

    if (slotAppointments.length <= 1) {
      // No staggering needed
      return slotAppointments.map((appt) => ({
        ...appt,
        width: "calc(100% - 4px)",
        left: "2px",
      }));
    }

    // Stagger appointments by dividing width
    const appointmentCount = slotAppointments.length;
    const widthPercentage = 100 / appointmentCount;

    return slotAppointments.map((appt, index) => ({
      ...appt,
      width: `calc(${widthPercentage}% - 4px)`,
      left: `calc(${index * widthPercentage}% + 2px)`,
      zIndex: 10 - index, // Lower z-index for later appointments
    }));
  };

  return (
    <div className="p-6">
      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Time Column */}
        <div className="lg:col-span-1">
          <div className="h-12"></div>
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-16 border-t border-gray-200 flex items-center justify-end pr-2"
            >
              <span className="text-sm text-gray-500">{time}</span>
            </div>
          ))}
        </div>

        {/* Day Columns - All 7 days */}
        {weekDates.map((dayDate, dayIndex) => {
          const dayAppointments = appointments.filter(
            (appt) => formatDate(appt.date) === formatDate(dayDate)
          );
          const isToday = dayDate.toDateString() === new Date().toDateString();
          const isWeekend = dayIndex >= 5; // Saturday (5) and Sunday (6)

          return (
            <div key={dayIndex} className={`lg:col-span-1 relative `}>
              {/* Day Header */}
              <div
                className={`h-12 flex flex-col items-center justify-center font-medium border-b ${
                  isToday ? "border-[#54c2bc]" : "border-gray-200"
                }`}
              >
                <div
                  className={`text-sm ${
                    isToday ? "text-[#54c2bc] font-semibold" : "text-gray-700"
                  }`}
                >
                  {dayDate.toLocaleDateString("fr-FR", { weekday: "short" })}
                </div>
                <div
                  className={`text-xs ${
                    isToday ? "text-[#54c2bc]" : "text-gray-500"
                  }`}
                >
                  {dayDate.getDate()}
                </div>
              </div>

              {/* Appointments for this day */}
              {timeSlots.map((time) => {
                const staggeredAppointments = getStaggeredAppointments(
                  time,
                  dayAppointments
                );

                return (
                  <div
                    key={`${dayIndex}-${time}`}
                    className="h-16 border-t border-gray-200 relative"
                  >
                    {staggeredAppointments.map((appointment) => {
                      const status = statusOptions.find(
                        (s) => s.value === appointment.status
                      );
                      const durationSlots = Math.max(
                        1,
                        parseInt(appointment.duration) / 30
                      );

                      return (
                        <div
                          key={appointment._id}
                          className="absolute p-2 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          style={{
                            backgroundColor: `${status?.color}15`,
                            borderColor: status?.color,
                            height: `${durationSlots * 2}rem`,
                            top: "2px",
                            width: appointment.width,
                            left: appointment.left,
                            zIndex: appointment.zIndex || 10,
                          }}
                          onClick={() => handleAppointmentSelect(appointment)}
                          title={`${appointment.title} - ${
                            appointment.patient_ref?.personalInfo.firstName ||
                            "Patient"
                          } (${formatTime(
                            appointment.start_time
                          )} - ${calculateEndTime(
                            appointment.start_time,
                            appointment.duration
                          )})`}
                        >
                          <div className="overflow-hidden h-full">
                            <div
                              className="font-medium text-xs truncate mb-1"
                              style={{ color: status?.color }}
                            >
                              {appointment.title}
                            </div>
                            <div className="text-[10px] text-gray-600 truncate">
                              {appointment?.patient_ref?.personalInfo.firstName?.charAt(
                                0
                              )}
                              .{appointment?.patient_ref?.personalInfo.lastName}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1">
                              {formatTime(appointment.start_time)}
                            </div>
                            {durationSlots > 1 && (
                              <div className="text-[9px] text-gray-400 mt-1">
                                {appointment.duration} min
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Day summary footer */}
              <div className="h-8 border-t border-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">
                  {dayAppointments.length} RDV
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Légende</h4>
        <div className="flex flex-wrap gap-3">
          {statusOptions.map((status) => (
            <div key={status.value} className="flex items-center">
              <div
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: status.color }}
              ></div>
              <span className="text-xs text-gray-600">{status.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Résumé de la semaine
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {weekDates.map((dayDate, index) => {
            const dayAppointments = appointments.filter(
              (appt) => formatDate(appt.date) === formatDate(dayDate)
            );
            const isToday =
              dayDate.toDateString() === new Date().toDateString();
            const isWeekend = index >= 5;

            return (
              <div
                key={dayDate.toISOString()}
                className={`p-3 rounded-lg border ${
                  isToday
                    ? "border-[#54c2bc] bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div
                      className={`font-medium text-sm ${
                        isToday ? "text-[#54c2bc]" : "text-gray-900"
                      }`}
                    >
                      {dayDate.toLocaleDateString("fr-FR", {
                        weekday: "short",
                      })}
                    </div>
                    <div className={`text-xs ${"text-gray-500"}`}>
                      {dayDate.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded ${"bg-gray-100 text-gray-600"}`}
                  >
                    {dayAppointments.length}
                  </span>
                </div>

                {dayAppointments.length > 0 ? (
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((appt) => {
                      const status = statusOptions.find(
                        (s) => s.value === appt.status
                      );
                      return (
                        <div key={appt._id} className="text-xs">
                          <div className="flex items-center">
                            <div
                              className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                              style={{ backgroundColor: status?.color }}
                            ></div>
                            <span className="text-gray-700 truncate">
                              {formatTime(appt.start_time)} {appt.title}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 3} autres
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic">
                    Aucun rendez-vous
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Weekly;
