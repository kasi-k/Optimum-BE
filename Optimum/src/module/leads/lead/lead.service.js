import IdcodeServices from "../../idcode/idcode.service.js";
import LeadModel from "../../leads/lead/lead.model.js";
import CampaignModel from "../campaign/campaign.model.js";

class LeadService {
  static async createLead(leadData) {
    const idname = "Leads";
    const idcode = "L";

    // 1️⃣ generate incremental code
    await IdcodeServices.addIdCode(idname, idcode);
    const Lead_id = await IdcodeServices.generateCode(idname);
    if (!Lead_id) throw new Error("Failed to generate lead ID");

    // 2️⃣ find campaign using campaign_id (e.g., "Camp001")
    const campaign = await CampaignModel.findOne({
      campaign_id: leadData.campaign_id,
    });
    if (!campaign) throw new Error("Campaign not found");

    // 3️⃣ create lead
    const newLead = await LeadModel.create({
      ...leadData,
      lead_id: Lead_id, // 👈 store generated lead code
      campaign: campaign._id, // ObjectId reference
      campaign_id: campaign.campaign_id, // also store readable campaign_id
    });

    // 4️⃣ update campaign with this lead reference
    campaign.leads.push(newLead._id);
    await campaign.save();

    return newLead;
  }
  static async getAllLeads() {
    return await LeadModel.find();
  }

  //   static async getLeadsByCampaignId(campaignId) {
  //     const campaign = await CampaignModel.findOne({
  //       campaign_id: campaignId,
  //     }).populate("leads");
  //     if (!campaign) throw new Error("Campaign not found");
  //     return campaign.leads;
  //   }

  // Update BD name for multiple leads
  static async transferLeads(leadIds, bdname) {
    if (!leadIds || leadIds.length === 0) {
      throw new Error("No leads selected");
    }
    if (!bdname) {
      throw new Error("BD name is required");
    }

    const result = await LeadModel.updateMany(
      { lead_id: { $in: leadIds } },
      { $set: { bdname } }
    );

    return result; // result.modifiedCount contains number of updated docs
  }

  static async deleteLead(leadId) {
    const lead = await LeadModel.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    // Remove the lead from the campaign's leads array
    await CampaignModel.findByIdAndUpdate(
      lead.campaign,
      { $pull: { leads: lead._id } },
      { new: true }
    );

    // Delete the lead document
    await LeadModel.findByIdAndDelete(leadId);

    return { message: "Lead deleted successfully" };
  }
}

export default LeadService;
