import { generatePassword } from "../../../utils/generatePassword.js";
import { isWithinOffice } from "../../config/VerifyLocation.js";
import IdcodeServices from "../idcode/idcode.service.js";
import RoleModel from "../role/role.model.js";
import TaskModel from "../task/task.model.js";
import EmployeeModel from "./employee.model.js";
import bcrypt from "bcryptjs";

function maskEmail(email) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return "****"; // fallback if invalid email
  if (user.length <= 2) return `**@${domain}`;
  const first = user.slice(0, 1);
  return `${first}*****@${domain}`;
}

class EmployeeService {
  static async addEmployee(employeeData) {
    const idname = "EMPLOYEE";
    const idcode = "EMP";
    await IdcodeServices.addIdCode(idname, idcode);
    const employee_id = await IdcodeServices.generateCode(idname);
    if (!employee_id) throw new Error("Failed to generate employee ID");

    const employee = new EmployeeModel({
      employee_id,
      ...employeeData, // role is not included
    });

    await employee.save();

    return {
      message: "Employee created successfully",
      employee: {
        id: employee._id,
        employee_id: employee.employee_id,
        name: employee.name,
      },
    };
  }
  static async loginEmployee(data) {
    const { identifier, password, location } = data; // location = { lat, lng }

    // 1️⃣ Find employee by email or phone
    const employee = await EmployeeModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!employee) throw new Error("Employee not found");

    // 2️⃣ Check if employee has role assigned
    if (!employee.role_id)
      throw new Error("Role not assigned yet. Cannot login.");

    // 3️⃣ Fetch role details
    const role = await RoleModel.findOne({ role_id: employee.role_id });
    if (!role) throw new Error("Role data not found");

    // 4️⃣ Verify password
    if (!employee.password)
      throw new Error("Employee has no password assigned");
    const isValid = await bcrypt.compare(password, employee.password);
    if (!isValid) throw new Error("Invalid password");
       // Save previous login time
    const previousLogin = employee.lastlogin || null;

    // Update last login to current time
    employee.lastlogin = new Date();
    await employee.save();
    const empId = employee.employee_id.trim();
    const tasks = await TaskModel.find({
      assigned_to: { $regex: `^${empId}$`, $options: "i" },
    });
    // 5️⃣ Check office location if WFH not approved
    if (!employee.wfhApproved) {
      if (!location) throw new Error("Location required for office login");

      if (!employee.officeLocation || employee.officeLocation.lat === undefined)
        throw new Error(
          "Employee office location not set. Cannot login at office."
        );

      const { lat: userLat, lng: userLng } = location;
      const { lat: officeLat, lng: officeLng } = employee.officeLocation;

      const allowed = isWithinOffice(
        userLat,
        userLng,
        officeLat,
        officeLng,
        0.1
      ); // 100 meters
      if (!allowed)
        throw new Error("Login allowed only within office location");
    }

    // 6️⃣ Return employee info with role
    return {
      message: "Login successful",
      employee: {
        id: employee._id,
        employee_id: employee.employee_id,
        name: employee.name,
        email: maskEmail(employee.email),
        role: {
          role_id: role.role_id,
          role_name: role.role_name,
          accessLevels: role.accessLevels,
        },
        wfhApproved: employee.wfhApproved,
        status: employee.status,
        tasks,
           lastlogin: previousLogin,
        
      },
    };
  }

  // Other existing methods...
  static async getAllEmployees() {
    return await EmployeeModel.find();
  }

  static async getEmployeeById(employee_id) {
    return await EmployeeModel.findOne({ employee_id });
  }

  static async getActiveEmployees() {
    return await EmployeeModel.find({ status: "ACTIVE" });
  }

  static async updateEmployee(employee_id, updateData) {
    const employee = await EmployeeModel.findOne({ employee_id });
    if (!employee) throw new Error("Employee not found");

    let plainPassword, hashedPassword;

    // Generate password only if role is assigned now and employee had no role before
    if (updateData.role_name && !employee.role_name) {
      plainPassword = generatePassword(employee.name, employee_id);
      hashedPassword = await bcrypt.hash(plainPassword, 10);
      updateData.password = hashedPassword;
    }

    const updatedEmployee = await EmployeeModel.findOneAndUpdate(
      { employee_id },
      { $set: updateData },
      { new: true }
    );

    return {
      employee: updatedEmployee,
      ...(plainPassword && { generatedPassword: plainPassword }),
    };
  }

  static async deleteEmployee(employee_id) {
    return await EmployeeModel.findOneAndDelete({ employee_id });
  }

  // Search employees (by name, email, phone, site)
  static async searchEmployees(keyword) {
    return await EmployeeModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { contact_email: { $regex: keyword, $options: "i" } },
        { contact_phone: { $regex: keyword, $options: "i" } },
        { site_assigned: { $regex: keyword, $options: "i" } },
      ],
    });
  }

  // 📌 Paginated, Search, Date filter
  static async getEmployeesPaginated(page, limit, search, fromdate, todate) {
    const query = {};

    // Keyword Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { contact_email: { $regex: search, $options: "i" } },
        { contact_phone: { $regex: search, $options: "i" } },
        { site_assigned: { $regex: search, $options: "i" } },
      ];
    }

    // Date Filtering (by createdAt)
    if (fromdate || todate) {
      query.createdAt = {};
      if (fromdate) query.createdAt.$gte = new Date(fromdate);
      if (todate) {
        const endOfDay = new Date(todate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        query.createdAt.$lte = endOfDay;
      }
    }

    const total = await EmployeeModel.countDocuments(query);
    const employees = await EmployeeModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { total, employees };
  }

  static async markAttendance(employee_id, date, present, remarks = "") {
    return await EmployeeModel.updateOne(
      { employee_id, "daily_attendance.date": { $ne: date } },
      { $push: { daily_attendance: { date, present, remarks } } }
    );
  }

  // 📌 Update existing attendance
  static async updateAttendance(employee_id, date, present, remarks = "") {
    return await EmployeeModel.updateOne(
      { employee_id, "daily_attendance.date": date },
      {
        $set: {
          "daily_attendance.$.present": present,
          "daily_attendance.$.remarks": remarks,
        },
      }
    );
  }

  // 📌 Get attendance for date range
  static async getAttendance(employee_id, startDate, endDate) {
    const emp = await EmployeeModel.findOne(
      { employee_id },
      { daily_attendance: 1, _id: 0 }
    );

    if (!emp) return null;

    return emp.daily_attendance.filter(
      (att) => att.date >= new Date(startDate) && att.date <= new Date(endDate)
    );
  }
}

export default EmployeeService;
