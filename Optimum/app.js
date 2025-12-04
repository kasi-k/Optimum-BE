import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import {
  scheduleCronJobs,
  scheduleCronWFH,
  scheduleCronLeaveStatus,
} from "./src/config/cron.js";

import connectDB from "./src/config/db.js";
import roleRoute from "./src/module/role/role.route.js";
import morgan from "morgan";
import logger from "./src/config/logger.js";
import employeeRoute from "./src/module/employee/employee.route.js";
import appointmentRoute from "./src/module/appointment/appointment.route.js";
import taskRoute from "./src/module/task/task.route.js";
import campaignRoute from "./src/module/leads/campaign/campaign.route.js";
import leadRoute from "./src/module/leads/lead/lead.route.js";
import doctorRoute from "./src/module/doctor/doctor.route.js";
import hospitalRoute from "./src/module/hospital/hospital.route.js";
import notificationRoute from "./src/module/notifications/notify.route.js";
import WFHRoute from "./src/module/wfh/wfh.route.js";
import LeaveRoute from "./src/module/leave/leave.route.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

scheduleCronJobs();
scheduleCronWFH();
scheduleCronLeaveStatus();

//middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Add Morgan Middleware for Logging
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

logger.info("Server started successfully");

app.use("/role", roleRoute);
app.use("/employee", employeeRoute);
app.use("/appointment", appointmentRoute);
app.use("/task", taskRoute);
app.use("/campaign", campaignRoute);
app.use("/lead", leadRoute);
app.use("/doctor", doctorRoute);
app.use("/hospital", hospitalRoute);
app.use("/notify", notificationRoute);
app.use("/wfh", WFHRoute);
app.use("/leave", LeaveRoute);

app.get("/", (req, res) => {
  res.send(`Welcome to Optimum Backend`);
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
