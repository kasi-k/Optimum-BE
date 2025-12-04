import mongoose from "mongoose";

const dailyAttendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true }, // The day attendance is recorded
    present: { type: Boolean, required: true }, // true = Present, false = Absent
    remarks: String,
    // Optional: late, leave, overtime, etc.
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    employee_id: { type: String, unique: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "", unique: true },
    role_name: { type: String, default: "" },
    role_id: { type: String, default: "" },
    password: { type: String },
    language: { type: String },
    rpperson: { type: String },
    lastlogin: { type: Date },
    department: { type: String },
    status: { type: String, default: "ACTIVE" },
    wfhApproved: { type: Boolean, default: false },
    leaveApproved: { type: Boolean, default: false },
    officeLocation: {
      lat: { type: Number, required: true, default: 9.9272833 }, // example default
      lng: { type: Number, required: true, default: 78.2134346 },
    },
    created_by: String,

    // 📅 Attendance Added
    daily_attendance: [dailyAttendanceSchema],
  },
  { timestamps: true }
);

const EmployeeModel = mongoose.model("Employees", employeeSchema);

export default EmployeeModel;
