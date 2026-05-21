const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");

router.post(
  "/",
  // authenticate,
  appointmentController.createAppointment
);
router.get(
  "/stats",
  // authenticate,
  appointmentController.getAppointmentStats
);
router.get(
  "/date-day/:date",
  // authenticate,
  appointmentController.getDayAppointmentsByDate
);
router.get(
  "/date-week/:date",
  // authenticate,
  appointmentController.getDayAppointmentsByDate
);
router.get(
  "/next7days",
  // authenticate,
  appointmentController.getNext7DaysAppointments
);
router.get(
  "/:id",
  // authenticate,
  appointmentController.getAppointmentById
);

router.patch(
  "/:id",
  // authenticate,
  appointmentController.updateAppointment
);
router.delete(
  "/:id",
  // authenticate,
  appointmentController.deleteAppointment
);

module.exports = router;
