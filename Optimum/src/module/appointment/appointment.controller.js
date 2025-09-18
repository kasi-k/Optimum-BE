
import AppointmentService from "./appointment.service.js"

export const createAppointment = async (req, res) => {
  try {
    const data = await AppointmentService.addAppointment(req.body);
    res.status(201).json({ status: true, message: "Appointment created", data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const data = await AppointmentService.getAllAppointments();
    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const data = await AppointmentService.updateAppointment(req.params.token_id, req.body);
    if (!data) return res.status(404).json({ status: false, message: "Appointment not found" });
    res.status(200).json({ status: true, message: "Appointment updated", data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};