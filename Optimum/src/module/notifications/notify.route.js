import {Router} from "express";
import {

  getEmployeeNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notify.controller.js";

const notificationRoute = Router();

notificationRoute.get("/:employeeId", getEmployeeNotifications);
notificationRoute.patch("/readall/:employeeId", markAllNotificationsRead);
notificationRoute.patch("/read/:_id", markNotificationRead);

export default notificationRoute;
