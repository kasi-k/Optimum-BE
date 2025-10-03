import IdcodeServices from "../idcode/idcode.service.js";
import CampaignModel from "../leads/campaign/campaign.model.js";
import CampaignService from "../leads/campaign/campaign.service.js";
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

  static async createAppointment(appointmentData) {
     const idname = "Token";
     const idcode = "Tk";
   
     // 1️⃣ generate incremental code
     await IdcodeServices.addIdCode(idname, idcode);
     const token_id = await IdcodeServices.generateCode(idname);
     if (!token_id) throw new Error("Failed to generate Token ID");
   
     // 2️⃣ find campaign using campaign_id (e.g., "Camp001")
     const campaign = await CampaignModel.findOne({
       campaign_id: appointmentData.campaign_id,
     });
     if (!campaign) throw new Error("Campaign not found");
   
     // 3️⃣ create lead
     const newappointment = await AppointmentModel.create({
       ...appointmentData,
       token_id: token_id,        // 👈 store generated lead code
       campaign: campaign._id,  // ObjectId reference
       campaign_id: campaign.campaign_id, // also store readable campaign_id
     });
   
     // 4️⃣ update campaign with this lead reference
     campaign.appointments.push(newappointment._id);
     await campaign.save();
   
     return newappointment;
   
  }

  static async getAppointmentsByCampaign(campaignId) {
    return await AppointmentModel.find({ campaign: campaignId });
  }

  static async updateAppointment(token_id, updateData) {
    return await AppointmentModel.findOneAndUpdate(
      { token_id },
      { $set: updateData },
      { new: true }
    );
  }
    static async deleteAppointment(appId) {
    const appointment = await AppointmentModel.findById(appId);
    if (!appointment) throw new Error("Appointment not found");

    // Remove the appointment from the campaign's appointments array
    await CampaignModel.findByIdAndUpdate(
      appointment.campaign,
      { $pull: { appointments: appointment._id } },
      { new: true }
    );

    // Delete the appointment document
    await AppointmentModel.findByIdAndDelete(appId);

    return { message: "Appointment deleted successfully" };
  }

}

export default AppointmentService;
