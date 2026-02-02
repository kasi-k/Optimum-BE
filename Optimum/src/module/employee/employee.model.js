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
    fatherName: { type: String, required: true }, // ✅ NEW
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "", unique: true },
    role_name: { type: String, default: "" },
    role_id: { type: String, default: "" },
    password: { type: String },
    language: { type: String },
    rpperson: { type: String }, // Reporting Person ID
    lastlogin: { type: Date },
    department: { type: String },
    jobTitle: { type: String, required: true }, // ✅ NEW
    qualification: { type: String, required: true }, // ✅ NEW
    dateOfJoining: { type: Date, required: true }, // ✅ NEW
    status: { type: String, enum: ['Active', 'Resigned', 'Terminated'], default: "Active" }, // ✅ UPDATED
    adhaarNumber: { type: String, required: true, unique: true }, // ✅ NEW
    bankAccount: { type: String, required: true }, // ✅ NEW
    // bankIfsc: { type: String, required: true }, // ✅ NEW
    ctc: { type: Number, required: true, min: 10000 }, // ✅ NEW
    // healthInsurance: { type: String, enum: ['Yes - Company Provided', 'No', 'Private'], required: true }, // ✅ NEW
    leaveBalance: { type: Number, default: 0, min: 0 }, // ✅ NEW
    lastIncrementDate: { type: Date }, // ✅ NEW
    lastIncrementCtc: { type: Number, min: 0 }, // ✅ NEW
    exitDate: { type: Date }, // ✅ NEW
    wfhApproved: { type: Boolean, default: false },
    leaveApproved: { type: Boolean, default: false },
    officeLocation: {
      lat: { type: Number, required: true, default: 9.9272833 }, // Chennai default
      lng: { type: Number, required: true, default: 78.2134346 },
    },
    created_by: String,
    // File upload paths
    aadhaar: { type: String }, // ✅ NEW - Path to uploaded Aadhaar file
    healthInsuranceFile: { type: String }, // ✅ NEW - Path to uploaded Health Insurance file

    // 📅 Attendance Added (KEEPING EXISTING)
    daily_attendance: [dailyAttendanceSchema],
  },
  { 
    timestamps: true 
  }
);

const EmployeeModel = mongoose.model("Employees", employeeSchema);

export default EmployeeModel;
