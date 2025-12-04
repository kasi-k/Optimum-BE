import IdcodeServices from "../idcode/idcode.service.js";
import CampaignModel from "../leads/campaign/campaign.model.js";
import CampaignService from "../leads/campaign/campaign.service.js";
import AppointmentModel from "./appointment.model.js";

class AppointmentService {
  static async addAppointment(appointmentData) {
    // Generate Token ID
    const tokenName = "Token";
    const tokenCode = "Tk";
    await IdcodeServices.addIdCode(tokenName, tokenCode);
    const token_id = await IdcodeServices.generateCode(tokenName);
    if (!token_id) throw new Error("Failed to generate token ID");

    // Generate OPD/IPD numbers if applicable
    let opd_number = null;
    let ipd_number = null;

    if (appointmentData.patient_type === "OPD") {
      const opdName = "OPD";
      const opdCode = "OPD";
      await IdcodeServices.addIdCode(opdName, opdCode);
      opd_number = await IdcodeServices.generateCode(opdName);
    }

    if (appointmentData.patient_type === "IPD") {
      const ipdName = "IPD";
      const ipdCode = "IPD";
      await IdcodeServices.addIdCode(ipdName, ipdCode);
      ipd_number = await IdcodeServices.generateCode(ipdName);
    }

    const appointment = new AppointmentModel({
      token_id,
      opd_number,
      ipd_number,
      ...appointmentData,
    });

    return await appointment.save();
  }

  static async createAppointment(appointmentData) {
    // Generate Token ID
    const tokenName = "Token";
    const tokenCode = "Tk";
    await IdcodeServices.addIdCode(tokenName, tokenCode);
    const token_id = await IdcodeServices.generateCode(tokenName);
    if (!token_id) throw new Error("Failed to generate Token ID");

    // Generate OPD/IPD numbers
    let opd_number = null;
    let ipd_number = null;

    if (appointmentData.patient_type === "OPD") {
      const opdName = "OPD";
      const opdCode = "OPD";
      await IdcodeServices.addIdCode(opdName, opdCode);
      opd_number = await IdcodeServices.generateCode(opdName);
    }

    if (appointmentData.patient_type === "IPD") {
      const ipdName = "IPD";
      const ipdCode = "IPD";
      await IdcodeServices.addIdCode(ipdName, ipdCode);
      ipd_number = await IdcodeServices.generateCode(ipdName);
    }

    // Link campaign
    const campaign = await CampaignModel.findOne({
      campaign_id: appointmentData.campaign_id,
    });
    if (!campaign) throw new Error("Campaign not found");

    const newappointment = await AppointmentModel.create({
      ...appointmentData,
      token_id,
      opd_number,
      ipd_number,
      campaign: campaign._id,
      campaign_id: campaign.campaign_id,
    });

    campaign.appointments.push(newappointment._id);
    await campaign.save();

    return newappointment;
  }

  static async getAllAppointments() {
    return await AppointmentModel.find();
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
