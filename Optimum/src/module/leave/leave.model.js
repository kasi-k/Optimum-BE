import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: true,
    },
    reportingPerson: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["Sick", "Casual", "Paid","Unpaid","Annual", "Maternity", "Paternity"],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    leaveApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "DECLINED", "EXPIRED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const LeaveModel = mongoose.model("Leave", leaveSchema);
export default LeaveModel;
