// cronJobs.js
import cron from "node-cron";
import TaskModel from "../module/task/task.model.js";

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
export const scheduleCronWFH = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running WFH auto-reset job...");
      await WFHService.resetExpiredWFH();
      console.log("WFH auto-reset completed!");
    } catch (err) {
      console.error("Error in WFH auto-reset:", err.message);
    }
  });
};
