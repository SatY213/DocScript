const Appointment = require("../models/appointment");

// ----------------------------------------------------
//  GET ALL APPOINTMENTS
// ----------------------------------------------------
exports.getAppointmentStats = async (req, res) => {
  try {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);

    // All stats in one query using aggregation
    const userId = req.user.id;

    const stats = await Appointment.aggregate([
      {
        $facet: {
          total: [{ $match: { user_ref: userId } }, { $count: "count" }],

          today: [
            { $match: { user_ref: userId, date: todayDate } },
            { $count: "count" },
          ],

          scheduled: [
            { $match: { user_ref: userId, status: "scheduled" } },
            { $count: "count" },
          ],

          confirmed: [
            { $match: { user_ref: userId, status: "confirmed" } },
            { $count: "count" },
          ],

          completed: [
            { $match: { user_ref: userId, status: "completed" } },
            { $count: "count" },
          ],

          cancelled: [
            { $match: { user_ref: userId, status: "cancelled" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const format = (arr) => (arr.length ? arr[0].count : 0);

    res.status(200).json({
      success: true,
      stats: {
        total: format(stats[0].total),
        today: format(stats[0].today),
        scheduled: format(stats[0].scheduled),
        confirmed: format(stats[0].confirmed),
        completed: format(stats[0].completed),
        cancelled: format(stats[0].cancelled),
      },
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({
      success: false,
      message: "Impossible d'obtenir les statistiques.",
      error: err.message,
    });
  }
};

// ----------------------------------------------------
//  GET DAY APPOINTMENTS BY DATE
// ----------------------------------------------------
exports.getDayAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params; // YYYY-MM-DD

    const appointments = await Appointment.find({ date, user_ref: req.user.id })
      .populate("patient_ref", "personalInfo")
      .sort({ start_time: 1 })
      .lean();
    res.status(200).json({
      success: true,
      date,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments by date:", error);

    res.status(500).json({
      success: false,
      message: "Impossible d'obtenir les rendez-vous du jour.",
      error: error.message,
    });
  }
};
// ----------------------------------------------------
//  GET WEEK APPOINTMENTS BY DATE
// ----------------------------------------------------
exports.getWeekAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params; // YYYY-MM-DD

    // Convert to actual JS Date object
    const startDate = new Date(date);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD.",
      });
    }

    // End date = start date + 6 days
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Convert back to YYYY-MM-DD for querying
    const startString = startDate.toISOString().split("T")[0];
    const endString = endDate.toISOString().split("T")[0];

    const appointments = await Appointment.find({
      date: { $gte: startString, $lte: endString },
      user_ref: req.user.id,
    })
      .populate("patient_ref", "personalInfo")
      .sort({ date: 1, start_time: 1 })
      .lean();

    res.status(200).json({
      success: true,
      range: {
        start: startString,
        end: endString,
      },
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching week appointments:", error);

    res.status(500).json({
      success: false,
      message: "Impossible d'obtenir les rendez-vous de la semaine.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  GET APPOINTMENTS FOR NEXT 7 DAYS
// ----------------------------------------------------
exports.getNext7DaysAppointments = async (req, res) => {
  try {
    // Today (00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 7 days later (end of day)
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    sevenDaysLater.setHours(23, 59, 59, 999);

    // Query appointments in this date range
    const appointments = await Appointment.find({
      date: {
        $gte: today.toISOString().split("T")[0],
        $lte: sevenDaysLater.toISOString().split("T")[0],
      },
      user_ref: req.user.id,
    })
      .populate("patient_ref", "personalInfo")
      .sort({ date: 1, start_time: 1 })
      .lean();

    res.status(200).json({
      success: true,
      total: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching next 7 days appointments:", error);

    res.status(500).json({
      success: false,
      message: "Impossible d'obtenir les rendez-vous des 7 prochains jours.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  CREATE APPOINTMENT
// ----------------------------------------------------
exports.createAppointment = async (req, res) => {
  try {
    req.body.user_ref = req.user.id;
    const newAppointment = new Appointment(req.body);
    const saved = await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Rendez-vous créé avec succès.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Échec de la création du rendez-vous.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  GET APPOINTMENT BY ID
// ----------------------------------------------------
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous non trouvé.",
      });
    }
    if (appointment.user_ref.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé." });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({
      success: false,
      message: "Échec de la récupération du rendez-vous.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  UPDATE APPOINTMENT
// ----------------------------------------------------
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous non trouvé.",
      });
    }

    if (appointment.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Rendez-vous mis à jour avec succès.",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Échec de la mise à jour du rendez-vous.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
//  DELETE APPOINTMENT
// ----------------------------------------------------
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous non trouvé.",
      });
    }

    if (appointment.user_ref.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Rendez-vous supprimé avec succès.",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      message: "Échec de la suppression du rendez-vous.",
      error: error.message,
    });
  }
};
