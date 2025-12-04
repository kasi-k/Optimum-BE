import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    lead_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    source: { type: String },
    age: { type: String },
    weight: { type: String },
    circle: { type: String },
    notes: { type: String },
    consultant: { type: String },
    bdname: { type: String, default: "" },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaigns" },
    campaign_id: { type: String },
    status: { type: String, default: "new" },
  },
  { timestamps: true }
);

const LeadModel = mongoose.model("Leads", leadSchema);
export default LeadModel;
