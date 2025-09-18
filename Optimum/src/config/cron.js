import cron from "node-cron";
import TaskModel from "../module/task/task.model.js";

cron.schedule("0 0 * * *", async () => {
  // Runs every midnight
  const today = new Date();
  await TaskModel.updateMany(
    { due_date: { $lt: today }, status: "doing" },
    { $set: { status: "incomplete" } }
  );
  console.log("✅ Overdue tasks updated to 'incomplete'");
});
