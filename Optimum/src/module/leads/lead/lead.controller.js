import LeadService from "./lead.service.js";
import jwt from "jsonwebtoken";

// ===============================
// CREATE LEAD
// ===============================
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
    const { role_name, name } = req.query;

    if (!role_name || !name) {
      return res.status(400).json({
        status: false,
        message: "role_name and name are required",
      });
    }

    const leads = await LeadService.getLeadsByRole(role_name, name);

    res.status(200).json({
      status: true,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};






// ===============================
// TRANSFER LEADS
// ===============================
export const transferLeads = async (req, res) => {
  try {
    const { leadIds, bdname } = req.body;

    await LeadService.transferLeads(leadIds, bdname);

    res.status(200).json({
      status: true,
      message: "Leads transferred successfully & Notification sent to BD",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ===============================
// DELETE LEAD
// ===============================
export const deleteLead = async (req, res) => {
  try {
    await LeadService.deleteLead(req.params.id);
    res.status(200).json({ status: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
