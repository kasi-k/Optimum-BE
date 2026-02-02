import { Router } from "express";
import {  createCampaign, getAllCampaigns, getCampaignById, whatsappFormUpdateController, whatsappInitialLeadController  } from "./campaign.controller.js";


const campaignRoute = Router();

campaignRoute.post("/create", createCampaign);
campaignRoute.get("/allcampaigns", getAllCampaigns);
campaignRoute.get("/:id", getCampaignById);
campaignRoute.post("/whatsapp/createlead", whatsappInitialLeadController);
campaignRoute.put("/whatsapp/updatelead", whatsappFormUpdateController);


export default campaignRoute;