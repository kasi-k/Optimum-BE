import IdcodeServices from "../idcode/idcode.service.js";
import AppointmentModel from "./appointment.model.js";


class AppointmentService {
  static async addAppointment(appointmentData) {
    const idname = "Token";
    const idcode = "Tk";
    await IdcodeServices.addIdCode(idname, idcode);
    const token_id = await IdcodeServices.generateCode(idname); 
    if (!token_id) throw new Error("Failed to generate token ID");

    const appointment = new AppointmentModel({
      token_id,
      ...appointmentData,
    });
    return await appointment.save();
  }

   static async getAllAppointments() {
    return await AppointmentModel.find();
  }

   static async updateAppointment(token_id, updateData) {
    return await AppointmentModel.findOneAndUpdate(
      { token_id},
      { $set: updateData },
      { new: true }
    );
  }
}

export default AppointmentService;