export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (timeString) => {
  return timeString.slice(0, 5);
};

export const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + parseInt(duration);
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, "0")}:${endMinutes
    .toString()
    .padStart(2, "0")}`;
};

export const getAppointmentsForTimeSlot = (timeSlot, todayAppointments) => {
  return todayAppointments?.filter((appt) => {
    const apptStart = appt.start_time.slice(0, 5);
    return apptStart === timeSlot;
  });
};

export const getWeekDates = (selectedDate) => {
  const date = new Date(selectedDate);

  // Get the Monday of the current week
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday

  const monday = new Date(date);
  monday.setDate(diff);

  const weekDates = [];

  // Get all 7 days from Monday to Sunday
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    weekDates.push(dayDate);
  }

  return weekDates;
};

export const formatWeekRange = (weekDates) => {
  const firstDay = weekDates[0];
  const lastDay = weekDates[6];
  return `${firstDay.getDate()} ${firstDay.toLocaleDateString("fr-FR", {
    month: "short",
  })} - ${lastDay.getDate()} ${lastDay.toLocaleDateString("fr-FR", {
    month: "short",
  })} ${lastDay.getFullYear()}`;
};

//  Group overlapping appointments
export const getOverlappingAppointments = (appointments) => {
  if (!appointments.length) return [];

  // Sort by start time
  const sorted = [...appointments].sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  const groups = [];
  sorted.forEach((appointment) => {
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

// Or a simpler alternative - just stagger appointments that start at same time
export const getStaggeredAppointments = (appointments) => {
  const appointmentsByTime = {};

  // Group appointments by their start time
  appointments.forEach((appointment) => {
    const timeKey = appointment.start_time;
    if (!appointmentsByTime[timeKey]) {
      appointmentsByTime[timeKey] = [];
    }
    appointmentsByTime[timeKey].push(appointment);
  });

  // For each time slot, stagger overlapping appointments
  Object.keys(appointmentsByTime).forEach((timeKey) => {
    const slotAppointments = appointmentsByTime[timeKey];
    if (slotAppointments.length > 1) {
      slotAppointments.forEach((appointment, index) => {
        appointment.staggerIndex = index;
        appointment.staggerTotal = slotAppointments.length;
      });
    }
  });

  return appointments;
};
