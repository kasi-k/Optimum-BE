import AppointmentModel from "../../appointment/appointment.model.js";
import IdcodeServices from "../../idcode/idcode.service.js";
import LeadModel from "../lead/lead.model.js";
import CampaignModel from "./campaign.model.js";

class CampaignService {
  static async createCampaign(campaignData) {
    const idname = "Campaign";
    const idcode = "CAMP";

    await IdcodeServices.addIdCode(idname, idcode);
    const campaign_id = await IdcodeServices.generateCode(idname);

    if (!campaign_id) throw new Error("Failed to generate campaign ID");

    // 🔥 Generate the link using campaign_id
    const campaignLink = `https://your-domain.com/campaign/${campaign_id}`;

    const campaign = new CampaignModel({
      campaign_id,
      campaignLink,
      ...campaignData,
    });

    return await campaign.save();
  }

  static async getAllCampaigns() {
    return await CampaignModel.find();
  }

  static async getCampaignById(campaignId) {
    return await CampaignModel.findById(campaignId)
      .populate("leads")
      .populate("appointments");
  }

  static async addLeadToCampaign(campaignId, leadId) {
    return await CampaignModel.findByIdAndUpdate(
      campaignId,
      { $push: { leads: leadId } },
      { new: true }
    );
  }

  static async addAppointmentToCampaign(campaignId, appointmentId) {
    return await CampaignModel.findByIdAndUpdate(
      campaignId,
      { $push: { appointments: appointmentId } },
      { new: true }
    );
  }
}

export default CampaignService;
