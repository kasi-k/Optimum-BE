import LeaveService from "./leave.service.js";

export const applyLeave = async (req, res) => {
  try {
    const leave = await LeaveService.applyLeave(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const respondLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const leave = await LeaveService.respondLeave(id, action);
    res.status(200).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLeavesByReportingPerson = async (req, res) => {
  try {
    const { reportingPerson } = req.params;
    const leaves = await LeaveService.getLeavesByReportingPerson(
      reportingPerson
    );
    res.status(200).json(leaves);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLeavesByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const leaves = await LeaveService.getLeavesByEmployee(employee_id);
    res.status(200).json(leaves);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
