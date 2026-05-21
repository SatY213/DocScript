import React from "react";
import {
  calculateEndTime,
  formatTime,
  getAppointmentsForTimeSlot,
  getOverlappingAppointments,
} from "./helper";
import { statusOptions, timeSlots } from "./data";

function Daily({ todayAppointments, handleAppointmentSelect }) {
  // Group appointments by time slot and handle overlaps
  const getAppointmentDisplayData = (timeSlot) => {
    const slotAppointments = getAppointmentsForTimeSlot(
      timeSlot,
      todayAppointments
    );

    // Sort by duration (longer first) for better stacking
    const sortedAppointments = [...slotAppointments].sort(
      (a, b) => parseInt(b.duration) - parseInt(a.duration)
    );

    // Group overlapping appointments
    const groups = [];
    sortedAppointments.forEach((appointment) => {
      let placed = false;

      // Try to place in existing group
      for (let group of groups) {
        const lastInGroup = group[group.length - 1];
        const appointmentEnd = calculateEndTime(
          appointment.start_time,
          appointment.duration
        );
        const lastEnd = calculateEndTime(
          lastInGroup.start_time,
          lastInGroup.duration
        );

        // If appointments don't overlap, add to this group
        if (appointment.start_time >= lastEnd) {
          group.push(appointment);
          placed = true;
          break;
        }
      }

      // If couldn't place in any group, create new group
      if (!placed) {
        groups.push([appointment]);
      }
    });

    return groups;
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Time Column */}
        <div className="lg:col-span-2">
          <div className="h-12 flex items-center justify-center font-medium text-gray-700">
            Heures
          </div>
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-16 border-t border-gray-200 flex items-center"
            >
              <span className="text-sm text-gray-500">{time}</span>
            </div>
          ))}
        </div>

        {/* Appointments Column */}
        <div className="lg:col-span-10 relative">
          <div className="h-12 flex items-center justify-center font-medium text-gray-700">
            Rendez-vous
          </div>
          {timeSlots.map((time) => {
            const appointmentGroups = getAppointmentDisplayData(time);

            return (
              <div
                key={time}
                className="h-16 border-t border-gray-200 relative"
              >
                {appointmentGroups.flat().map((appointment, index) => {
                  const status = statusOptions.find(
                    (s) => s.value === appointment.status
                  );

                  // Find which group this appointment belongs to
                  const groupIndex = appointmentGroups.findIndex((group) =>
                    group.includes(appointment)
                  );

                  // Calculate position based on group index
                  const groupPosition = groupIndex;
                  const groupCount = appointmentGroups.length;
                  const widthPercentage = 100 / Math.max(groupCount, 1);
                  const leftPosition = groupPosition * widthPercentage;

                  return (
                    <div
                      key={appointment._id}
                      className="absolute p-3 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      style={{
                        backgroundColor: `${status?.color}15`,
                        borderColor: status?.color,
                        left: `${leftPosition}%`,
                        width: `${widthPercentage - 2}%`,
                        marginLeft: "1%",
                        marginRight: "1%",
                        top: "2px",
                        bottom: "2px",
                        zIndex: 10 - groupPosition, // Higher z-index for first group
                      }}
                      onClick={() => handleAppointmentSelect(appointment)}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-1">
                          <div
                            className="font-medium text-xs truncate"
                            style={{ color: status?.color }}
                          >
                            {appointment.title}
                          </div>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: `${status?.color}20`,
                              color: status?.color,
                            }}
                          >
                            {status?.label}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-600 truncate mb-1">
                          {appointment?.patient_ref?.personalInfo.firstName +
                            " " +
                            appointment?.patient_ref?.personalInfo.lastName ||
                            "Patient"}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-auto">
                          {formatTime(appointment?.start_time)} -{" "}
                          {calculateEndTime(
                            appointment.start_time,
                            appointment.duration
                          )}{" "}
                          ({appointment?.duration} min)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Daily;
