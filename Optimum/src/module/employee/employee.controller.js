import EmployeeService from "./employee.service.js";

// 📌 Create Employee
export const createEmployee = async (req, res) => {
  try {
    const data = await EmployeeService.addEmployee(req.body);
    res.status(201).json({ status: true, message: "Employee created", data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 📌 Employee Login
export const loginEmployee = async (req, res) => {
  try {
    const result = await EmployeeService.loginEmployee(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ status: false, message: error.message });
  }
};

// 📌 Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const data = await EmployeeService.getAllEmployees();
    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 📌 Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const data = await EmployeeService.getEmployeeById(req.params.employee_id);
    if (!data)
      return res.status(404).json({ status: false, message: "Employee not found" });
    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 📌 Update employee
export const updateEmployee = async (req, res) => {
  try {
    const data = await EmployeeService.updateEmployee(req.params.employee_id, req.body);
    if (!data)
      return res.status(404).json({ status: false, message: "Employee not found" });
    res.status(200).json({ status: true, message: "Employee updated", data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 📌 Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const data = await EmployeeService.deleteEmployee(req.params.employee_id);
    if (!data)
      return res.status(404).json({ status: false, message: "Employee not found" });
    res.status(200).json({ status: true, message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 📌 Search employees
export const searchEmployees = async (req, res) => {
  try {
    const query = req.query.q || "";
    const data = await EmployeeService.searchEmployees(query);
    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 📌 Paginated employees with optional search + date filter
export const getEmployeesPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const fromdate = req.query.fromdate || null;
    const todate = req.query.todate || null;

    const result = await EmployeeService.getEmployeesPaginated(
      page,
      limit,
      search,
      fromdate,
      todate
    );

    res.status(200).json({
      status: true,
      currentPage: page,
      totalPages: Math.ceil(result.total / limit),
      totalRecords: result.total,
      data: result.employees,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 📌 Mark attendance manually
export const markAttendance = async (req, res) => {
  try {
    const { date, present, remarks } = req.body;
    const result = await EmployeeService.markAttendance(
      req.params.employee_id,
      new Date(date),
      present,
      remarks
    );
    res.status(200).json({ status: true, message: "Attendance marked", result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 📌 Update attendance manually
export const updateAttendance = async (req, res) => {
  try {
    const { date, present, remarks } = req.body;
    const result = await EmployeeService.updateAttendance(
      req.params.employee_id,
      new Date(date),
      present,
      remarks
    );
    res.status(200).json({ status: true, message: "Attendance updated", result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 📌 Get attendance (admin sees all, normal user sees only theirs)
export const getAttendance = async (req, res) => {
  try {
    const { month, year, role, employee_id } = req.query;

    let data;

    if (role === "admin") {
      // Admin: get all employees' attendance
      data = await EmployeeService.getAttendanceForAllEmployees(month, year);
    } else {
      // Normal user: get only their attendance
      const userAttendance = await EmployeeService.getAttendanceByEmployee(employee_id, month, year);
      // Wrap in array for uniform frontend structure
      data = [{ name: "Me", attendance: userAttendance }];
    }

    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const { employee_id, oldPassword, newPassword } = req.body;

    const message = await EmployeeService.changePassword(employee_id, oldPassword, newPassword);

    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeEmployeeRole = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const result = await EmployeeService.removeEmployeeRoleService(employee_id);

    res.status(200).json({
      message: result.message,
      data: result.employee,
    });
  } catch (error) {
    console.error("Error removing role:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};
