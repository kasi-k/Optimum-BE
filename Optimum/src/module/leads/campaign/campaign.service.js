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

    // // 🔥 Generate the link using campaign_id
    // const campaignLink = `https://your-domain.com/campaign/${campaign_id}`;

    const campaign = new CampaignModel({
      campaign_id,
    
      ...campaignData,
    });

    return await campaign.save();
  }

  static async getAllCampaigns() {
    return await CampaignModel.find().sort({ createdAt: -1 });
  }

  static async getCampaignById(campaignId) {
    return await CampaignModel.findById(campaignId).sort({ createdAt: -1 })
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

  static async checkWhatsAppLead(campaignId, phone) {
  const campaign = await CampaignModel.findOne({ campaignId});
  if (!campaign) throw new Error("Campaign not found");

  // const normalizedPhone = phoneNumber.replace(/\D/g, "");

  const lead = await LeadModel.findOne({ phone});

  if (lead) {
    // Existing lead → return info
    return {
      existing: true,
      message: "Phone number already exists",
      lead: { name: lead.name, phoneNumber: lead.phone, _id: lead._id }
    };
  } else {
    // New user → trigger WhatsApp form
    return {
      existing: false,
      message: "New user,please fill the form",
    };
  }
}


static async createLeadFromWhatsAppForm(leadData) {
  const phone = String(leadData.phone).replace(/\D/g, "");

  // Safety check again
  const existing = await LeadModel.findOne({ phone });
   if (existing) {
      // Throw an error or return a special response
      throw new Error("Phone number already exists");
    }

  // ✅ Generate lead_id ONLY HERE
  const idname = "Leads";
  const idcode = "L";
  await IdcodeServices.addIdCode(idname, idcode);
  const lead_id = await IdcodeServices.generateCode(idname);

  const campaign = await CampaignModel.findOne({
    campaignId: leadData.campaignId
  });
  if (!campaign) throw new Error("Campaign not found");

  console.log(campaign);
  

  const lead = await LeadModel.create({
    ...leadData,
    phone,
    lead_id,
    campaign: campaign._id,
    campaign_id: campaign.campaign_id,

  
  });

  campaign.leads.push(lead._id);
  await campaign.save();

  return { existing: false, lead };
}



}

export default CampaignService;
