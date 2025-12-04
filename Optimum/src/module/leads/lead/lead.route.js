import { Router } from "express";
import { createLead, deleteLead, getAllLeads, transferLeads } from "./lead.controller.js";


const leadRoute = Router();

leadRoute.post("/add", createLead);

// leadRoute.get("/campaign/:campaignId", getLeadsByCampaign);
leadRoute.get("/getallleads", getAllLeads);
leadRoute.put("/transferleads", transferLeads);
leadRoute.delete("/:id", deleteLead);



export default leadRoute;