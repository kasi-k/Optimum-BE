import AppointmentModel from "../../appointment/appointment.model.js";
import LeadModel from "../lead/lead.model.js";
import CampaignService from "./campaign.service.js";

export const createCampaign = async (req, res) => {
  try {
    const data = await CampaignService.createCampaign(req.body);
    res.status(201).json({ status: true, message: "Campaign created", data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const data = await CampaignService.getAllCampaigns();
    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await CampaignService.getCampaignById(req.params.id);
    if (!campaign) return res.status(404).json({ status: false, message: "Campaign not found" });
    res.status(200).json({ status: true, data: campaign });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

