import { Router } from "express";
import { checkWhatsAppLeadController, createCampaign, createLeadFromFormController, getAllCampaigns, getCampaignById  } from "./campaign.controller.js";


const campaignRoute = Router();

campaignRoute.post("/create", createCampaign);
campaignRoute.get("/allcampaigns", getAllCampaigns);
campaignRoute.get("/:id", getCampaignById);
campaignRoute.post("/whatsapp/lead", checkWhatsAppLeadController);
campaignRoute.post("/whatsapp/create-lead", createLeadFromFormController);


export default campaignRoute;