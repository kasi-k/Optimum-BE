import mongoose from "mongoose";
import "../leads/campaign/campaign.model.js";

const appointmentSchema = new mongoose.Schema(
  {
    token_id: { type: String, unique: true },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    date: { type: Date },
    slot: { type: String },
    doctor_name: { type: String },
    treatmentype: { type: String },
    notes: { type: String },
    status: { type: String, default: "confirmed" },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaigns" },
    campaign_id: { type: String },
  },

  { timestamps: true }
);

const AppointmentModel = mongoose.model("Appointments", appointmentSchema);

export default AppointmentModel;
