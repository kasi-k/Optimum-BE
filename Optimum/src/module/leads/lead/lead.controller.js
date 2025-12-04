import LeadService from "../../leads/lead/lead.service.js";
import LeadModel from "./lead.model.js";

export const createLead = async (req, res) => {
  try {
    const lead = await LeadService.createLead(req.body);
    res.status(201).json({ status: true, data: lead });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getAllLeads = async (req, res) => {
  try {
    const data = await LeadService.getAllLeads();
    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// export const getLeadsByCampaign = async (req, res) => {
//   try {
//     const leads = await LeadService.getLeadsByCampaignId(req.params.campaign_id);
//     res.status(200).json({ status: true, data: leads });
//   } catch (error) {
//     res.status(404).json({ status: false, message: error.message });
//   }
// };

export const transferLeads = async (req, res) => {
  try {
    const { leadIds, bdname } = req.body;

    if (!leadIds || leadIds.length === 0) {
      return res.status(400).json({ message: "No leads selected" });
    }
    if (!bdname) {
      return res.status(400).json({ message: "BD name is required" });
    }

    // Update multiple leads
    const result = await LeadModel.updateMany(
      { lead_id: { $in: leadIds } },
      { $set: { bdname } }
    );

    return res.status(200).json({
      message: `${result.modifiedCount} lead(s) updated successfully`,
    });
  } catch (error) {
    console.error("Error transferring leads:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LeadService.deleteLead(id);
    res.status(200).json({ status: true, message: result.message });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
