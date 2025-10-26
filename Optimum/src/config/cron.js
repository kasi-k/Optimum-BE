// cronJobs.js
import cron from "node-cron";
import TaskModel from "../module/task/task.model.js";
import WFHModel from "../module/wfh/wfh.model.js";

export const scheduleCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log(new Date(), "Cron job started");
      const today = new Date();
      const result = await TaskModel.updateMany(
        { due_date: { $lt: today }, status: "doing" },
        { $set: { status: "incomplete" } }
      );
      console.log("Updated tasks count:", result.modifiedCount);
      console.log("✅ Overdue tasks updated to 'incomplete'");
    } catch (err) {
      console.error("Cron job error:", err);
    }
  });
};
export const scheduleCronWFH = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of day

    // 1. Approve WFH where start_date is today or past and not approved yet
    const toApprove = await WFHModel.updateMany(
      {
        start_date: { $lte: today },
        approved: false,
        status: "pending", // optional filter
      },
      { $set: { approved: true } }
    );

    // 2. Expire WFH where end_date is before today and still approved
    const toExpire = await WFHModel.updateMany(
      {
        end_date: { $lt: today },
        approved: true,
      },
      { $set: { approved: false, status: "expired" } } // optional: mark expired
    );

    console.log(
      `WFH approved: ${toApprove.modifiedCount}, WFH expired: ${toExpire.modifiedCount}`
    );
  } catch (err) {
    console.error("Error in resetExpiredWFH:", err.message);
  }
};
