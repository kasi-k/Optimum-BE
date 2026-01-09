import { generatePassword } from "../../../utils/generatePassword.js";
import { isWithinOffice } from "../../config/VerifyLocation.js";
import IdcodeServices from "../idcode/idcode.service.js";
import RoleModel from "../role/role.model.js";
import TaskModel from "../task/task.model.js";
import EmployeeModel from "./employee.model.js";
import bcrypt from "bcryptjs";

// Attendance configuration
const CUTOFF_HOUR = 10; // 10 AM, change as needed
const GRACE_MINUTES = 15;
const ABSENT_HOUR = 20; // 11 PM, mark absent if not logged in by this hour

function maskEmail(email) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return "****";
  if (user.length <= 2) return `**@${domain}`;
  const first = user.slice(0, 1);
  return `${first}*****@${domain}`;
}

class EmployeeService {
  // ---------------------- Employee CRUD ----------------------
  static async addEmployee(employeeData) {
    const idname = "EMPLOYEE";
    const idcode = "EMP";
    await IdcodeServices.addIdCode(idname, idcode);
    const employee_id = await IdcodeServices.generateCode(idname);
    if (!employee_id) throw new Error("Failed to generate employee ID");

    const employee = new EmployeeModel({
      employee_id,
      ...employeeData,
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
    const { identifier, password, location } = data;

    const employee = await EmployeeModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!employee) throw new Error("Employee not found");
    if (!employee.role_id) throw new Error("Role not assigned yet");

    const role = await RoleModel.findOne({ role_id: employee.role_id });
    if (!role) throw new Error("Role data not found");

    if (!employee.password)
      throw new Error("Employee has no password assigned");
    const isValid = await bcrypt.compare(password, employee.password);
    if (!isValid) throw new Error("Invalid password");

    const previousLogin = employee.lastlogin || null;
    const now = new Date();
    employee.lastlogin = now;

    // ----------------- Attendance -----------------
    const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    let todayAttendance = employee.daily_attendance.find(
      (att) => att.date.toISOString().split("T")[0] === todayStr
    );

    const currentHour = now.getHours();

    if (!todayAttendance) {
      const cutoffTime = new Date(now);
      cutoffTime.setHours(CUTOFF_HOUR, GRACE_MINUTES, 0, 0); // 17:15

      const absentTime = new Date(now);
      absentTime.setHours(ABSENT_HOUR, 0, 0, 0); // 20:00

      if (now <= cutoffTime) {
        todayAttendance = {
          date: now,
          present: true,
          remarks: "Login on time",
        };
      } else if (now > cutoffTime && now < absentTime) {
        todayAttendance = { date: now, present: true, remarks: "Late" };
      } else {
        todayAttendance = { date: now, present: false, remarks: "Absent" };
      }

      employee.daily_attendance.push(todayAttendance);
    }

    await employee.save();

    const empId = employee.employee_id.trim();
    const tasks = await TaskModel.find({
      assigned_to: { $regex: `^${empId}$`, $options: "i" },
    });

    // ----------------- Office Location -----------------
    if (employee.department?.toLowerCase() !== "admin") {
      if (!employee.wfhApproved) {
        if (!location) throw new Error("Location required for office login");
        if (
          !employee.officeLocation ||
          employee.officeLocation.lat === undefined
        )
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
        );
        if (!allowed)
          throw new Error("Login allowed only within office location");
      }
    } else {
      console.log("Admin login detected — skipping office location check");
    }

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
          department_name: role.department_name,
          category_name: role.category_name,
        },
        department: employee.department,
        wfhApproved: employee.wfhApproved,
        status: employee.status,
        tasks,
        lastlogin: previousLogin,
      },
    };
  }

  // ---------------------- Existing methods ----------------------
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

  static async getEmployeesPaginated(page, limit, search, fromdate, todate) {
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { contact_email: { $regex: search, $options: "i" } },
        { contact_phone: { $regex: search, $options: "i" } },
        { site_assigned: { $regex: search, $options: "i" } },
      ];
    }

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

  // ---------------------- Attendance ----------------------
  static async markAttendance(employee_id, date, present, remarks) {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return await EmployeeModel.updateOne(
      { employee_id, "daily_attendance.date": { $ne: formattedDate } },
      { $push: { daily_attendance: { date: formattedDate, present, remarks } } }
    );
  }

  static async updateAttendance(employee_id, date, present, remarks) {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return await EmployeeModel.updateOne(
      { employee_id, "daily_attendance.date": formattedDate },
      {
        $set: {
          "daily_attendance.$.present": present,
          "daily_attendance.$.remarks": remarks,
        },
      }
    );
  }

  static async getAttendanceByEmployee(employee_id, month, year) {
    const employee = await EmployeeModel.findOne({ employee_id });
    if (!employee) return null;
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return employee.daily_attendance.filter(
      (att) => att.date >= start && att.date <= end
    );
  }

  static async getAttendanceForAllEmployees(month, year) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const employees = await EmployeeModel.find(
      {},
      { name: 1, employee_id: 1, daily_attendance: 1 }
    );

    return employees.map((emp) => ({
      employee_id: emp.employee_id,
      name: emp.name,
      attendance: emp.daily_attendance.filter(
        (att) => att.date >= start && att.date <= end
      ),
    }));
  }

  // ---------------------- Auto Absent ----------------------
  static async autoMarkAbsent() {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const hourNow = now.getHours();

    if (hourNow >= ABSENT_HOUR) {
      const employees = await EmployeeModel.find();

      for (const emp of employees) {
        const alreadyMarked = emp.daily_attendance.some(
          (att) => att.date.toISOString().split("T")[0] === todayStr
        );
        if (!alreadyMarked) {
          emp.daily_attendance.push({
            date: now,
            present: false,
            remarks: "Absent",
          });
          await emp.save();
        }
      }
    }
  }
  static async changePassword(employee_id, oldPassword, newPassword) {
    // 1️⃣ Find the employee by employee_code
    const employee = await EmployeeModel.findOne({ employee_id: employee_id });
    if (!employee) throw new Error("Employee not found");

    // 2️⃣ Verify old password
    const isMatch = await bcrypt.compare(oldPassword, employee.password);
    if (!isMatch) throw new Error("Old password is incorrect");

    // 3️⃣ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update the password in DB
    const updatedEmployee = await EmployeeModel.findOneAndUpdate(
      { employee_id: employee_id }, // ✅ filter object
      { password: hashedPassword }, // update
      { new: true } // return updated document
    );

    return {
      message: "Password changed successfully",
      employee: updatedEmployee,
    };
  }
  static async removeEmployeeRoleService(employee_id) {
    const employee = await EmployeeModel.findOne({ employee_id });
    if (!employee) throw new Error("Employee not found");

    // Just remove role fields
    employee.role_id = null;
    employee.role_name = null;

    await employee.save();

    return { message: "Role removed successfully", employee };
  }
}

export default EmployeeService;
