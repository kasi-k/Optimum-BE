import WFHService from "./wfh.service.js";

export const applyWFH = async (req, res) => {
  try {
    const { employee_id, fromDate, toDate, reason, reportingPerson } = req.body;

    if (!employee_id || !fromDate || !toDate || !reportingPerson) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    const wfh = await WFHService.applyWFH({
      employee_id,
      fromDate,
      toDate,
      reason,
      reportingPerson,
    });

    return res.json({ status: true, data: wfh });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const respondWFH = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // APPROVE or DECLINE
    const request = await WFHService.respondWFH(id, action);
    res.status(200).json({ status: true, data: request });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const getWFHForReportingPerson = async (req, res) => {
  try {
    const requests = await WFHService.getWFHByReportingPerson(req.params.reportingPersonId);
    res.status(200).json({ status: true, data: requests });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const getWFHForEmployee = async (req, res) => {
  try {
    const requests = await WFHService.getWFHByEmployee(req.params.employeeId);
    res.status(200).json({ status: true, data: requests });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};
