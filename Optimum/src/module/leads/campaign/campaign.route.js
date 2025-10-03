import { Router } from "express";
import { createCampaign, getAllCampaigns, getCampaignById,  } from "./campaign.controller.js";


const campaignRoute = Router();

campaignRoute.post("/create", createCampaign);
campaignRoute.get("/allcampaigns", getAllCampaigns);
campaignRoute.get("/:id", getCampaignById);


export default campaignRoute;