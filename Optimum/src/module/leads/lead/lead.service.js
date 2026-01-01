import LeadModel from "./lead.model.js";
import CampaignModel from "../campaign/campaign.model.js";
import IdcodeServices from "../../idcode/idcode.service.js";
import NotificationModel from "../../notifications/notify.model.js"
import EmployeeModel from "../../employee/employee.model.js";



class LeadService {
  // ===============================
  // CREATE LEAD
  // ===============================
  static async createLead(leadData) {
    const idname = "Leads";
    const idcode = "L";

    await IdcodeServices.addIdCode(idname, idcode);
    const lead_id = await IdcodeServices.generateCode(idname);
    if (!lead_id) throw new Error("Failed to generate lead ID");

    const campaign = await CampaignModel.findOne({
      campaign_id: leadData.campaign_id,
    });
    if (!campaign) throw new Error("Campaign not found");

    const lead = await LeadModel.create({
      ...leadData,
      lead_id,
      campaign: campaign._id,
      campaign_id: campaign.campaign_id,
    });

    campaign.leads.push(lead._id);
    await campaign.save();

    return lead;
  }

  // ===============================
  // GET LEADS BASED ON ROLE
  // ===============================
  static async getLeadsByRole(role_name, name) {
    // ADMIN → all leads
    if (role_name === "admin") {
      return await LeadModel.find().populate("campaign");
    }

    // BD / Employee → only their leads
    return await LeadModel.find({ bdname: name }).populate("campaign");
  }

  // ===============================
  // TRANSFER LEADS
  // ===============================
static async transferLeads(leadIds, bdname) {
  if (!leadIds?.length) {
    throw new Error("No leads selected");
  }
  if (!bdname) {
    throw new Error("BD name is required");
  }

  // 🔍 FIND BD USING NAME
  const bd = await EmployeeModel.findOne({
    name: bdname,
    role_name: "bd",
  });

  console.log(bd);
  

  if (!bd) {
    throw new Error("BD not found for given name");
  }

  // 1️⃣ Update leads
  await LeadModel.updateMany(
    { lead_id: { $in: leadIds } },
    {
      $set: {
        bdname
      },
    }
  );

  // 2️⃣ Create notification
  await NotificationModel.create({
    title: "New Leads Assigned",
    message: `You have been assigned ${leadIds.length} new lead(s).`,
    employeeId: bd.employee_id,
  });

  return true;
}
  // ===============================
  // DELETE LEAD
  // ===============================
  static async deleteLead(leadId) {
    const lead = await LeadModel.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    await CampaignModel.findByIdAndUpdate(lead.campaign, {
      $pull: { leads: lead._id },
    });

    await LeadModel.findByIdAndDelete(leadId);

    return { message: "Lead deleted successfully" };
  }
}

export default LeadService;
