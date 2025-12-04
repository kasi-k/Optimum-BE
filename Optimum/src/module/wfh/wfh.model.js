import mongoose from "mongoose";

const wfhSchema = new mongoose.Schema(
  {
    employee_id: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String },
    wfhApproved: { type: Boolean, default: false },
    status: { type: String, enum: ["PENDING", "APPROVED", "DECLINED"], default: "PENDING" },
    reportingPerson: { type: String, required: true }, // employee_id of the manager
  },
  { timestamps: true }
);

const WFHModel = mongoose.model("WFHRequest", wfhSchema);
export default WFHModel;
