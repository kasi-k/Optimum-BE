import mongoose from "mongoose";

const dailyAttendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true }, // The day attendance is recorded
    present: { type: Boolean, required: true }, // true = Present, false = Absent
    remarks: String, // Optional: late, leave, overtime, etc.
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    employee_id: { type: String, unique: true },
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    role_name: { type: String, default: "" },
    role_id: {type: String, default: "" },
    department: String,
    inpatient: { type: String, default: "Yes" },
    status: { type: String, default: "ACTIVE" },
    created_by: String,

    // 📅 Attendance Added
    daily_attendance: [dailyAttendanceSchema],
  },
  { timestamps: true }
);

const EmployeeModel = mongoose.model("Employees", employeeSchema);

export default EmployeeModel;
