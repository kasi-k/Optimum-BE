import CampaignService from "./campaign.service.js";

export const createCampaign = async (req, res) => {
  try {
    const data = await CampaignService.createCampaign(req.body);
    res.status(201).json({
      status: true,
      message: "Campaign created",
      data,
    });
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
    if (!campaign)
      return res.status(404).json({ status: false, message: "Campaign not found" });

    res.status(200).json({ status: true, data: campaign });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



export const whatsappInitialLeadController = async (req, res) => {
  try {
    const { campaignId, phone, name } = req.body;
    
    if (!campaignId || !phone) {
      return res.status(400).json({ 
        status: false, 
        message: "campaignId and phone required" 
      });
    }

    const result = await CampaignService.checkWhatsAppLead(campaignId, phone, name);
    console.log(result,"watapp leads");
    
    res.status(201).json({ status: true, ...result });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
    console.log(err.message,"watsapp error");
    
  }
};

export const whatsappFormUpdateController = async (req, res) => {
  try {
    const result = await CampaignService.updateWhatsAppLeadForm(req.body);
    res.status(200).json({ status: true, ...result });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};



