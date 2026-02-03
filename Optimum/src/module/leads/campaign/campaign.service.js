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

static async checkWhatsAppLead(campaignId, phone, name) {
  const campaign = await CampaignModel.findOne({ campaignId });
  if (!campaign) throw new Error("Campaign not found");

  const normalizedPhone = String(phone).replace(/\D/g, "");

  console.log(normalizedPhone,"leadswatapp");
  
  
  // ✅ STEP 1: ALWAYS check if phone exists
  let lead = await LeadModel.findOne({ phone: normalizedPhone });

  if (!lead) {
    // ✅ NEW USER → CREATE basic lead with name+phone FIRST
    console.log(`🎉 Creating NEW lead: ${campaignId} ${name} (${normalizedPhone})`);
    
    const idname = "Leads"; const idcode = "L";
    await IdcodeServices.addIdCode(idname, idcode);
    const lead_id = await IdcodeServices.generateCode(idname);

    lead = await LeadModel.create({
      name: name?.trim() || "WhatsApp User",
      phone: normalizedPhone,
      lead_id,
      campaign: campaign._id,
      campaign_id: campaign.campaign_id,
      source: "whatsapp",
      status: "pending_form"
    });
console.log(lead,"laedsgenerated");

    campaign.leads.push(lead._id);
    await campaign.save();

    return {
      existing: false,
      action: "created",
      message: "Basic lead created - waiting for form update",
      lead: { _id: lead._id, name: lead.name, phone: lead.phone, lead_id: lead.lead_id }
    };
  } else {
    // ✅ EXISTS → return existing lead
    return {
      existing: true,
      message: "Lead exists",
      lead: { _id: lead._id, name: lead.name, phone: lead.phone, lead_id: lead.lead_id }
    };
  }
}

// ✅ STEP 2: User fills WhatsApp FORM → Update the SAME lead
static async updateWhatsAppLeadForm(leadData) {
  const { phone, ...formFields } = leadData;
  const normalizedPhone = String(phone).replace(/\D/g, "");

  // ✅ Find the lead (MUST exist from step 1)
  const lead = await LeadModel.findOne({ phone: normalizedPhone });
  if (!lead) throw new Error("Lead not found - complete initial step first");

  // ✅ UPDATE with form data
  console.log(`📝 Updating lead: ${lead.lead_id} with form data`);
  
  const updatedLead = await LeadModel.findByIdAndUpdate(
    lead._id,
    { 
      ...formFields,
      status: "qualified",  // Mark as complete
      updatedAt: new Date()
    },
    { new: true }
  );

  return {
    success: true,
    message: "Lead updated successfully",
    lead: {
      _id: updatedLead._id,
      name: updatedLead.name,
      phone: updatedLead.phone,
      lead_id: updatedLead.lead_id,
      status: updatedLead.status
    }
  };
}



}

export default CampaignService;
