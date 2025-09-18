import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    token_id: { type: String, unique: true },
    name: { type: String, required: true },
    phone: { type: String },
    date: { type:Date },
    slot: { type: String },
    doctor_name: { type: String },
    status: { type: String, default: "confirmed" },
  },

  { timestamps: true }
);

const AppointmentModel = mongoose.model("Appointments", appointmentSchema);

export default AppointmentModel;
