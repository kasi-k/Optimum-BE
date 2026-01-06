import Lead from "../leads/lead/lead.model.js";

export const getRecentLeads = async (limit = 10) => {
  return await Lead.find()
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getLeadCounts = async () => {
  const [ipd, opd] = await Promise.all([
    Lead.countDocuments({ type: "IPD" }),
    Lead.countDocuments({ type: "OPD" }),
  ]);

  return { ipd, opd };
};
