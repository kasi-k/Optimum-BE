import NotificationModel from "./notify.model.js";

class NotificationService {
  static async createNotification({ title, message, employeeId, createdBy,actions,relatedId }) {
    const notification = new NotificationModel({
      title,
      message,
      employeeId,
      createdBy,
      actions,relatedId
    });

    await notification.save();
    return notification;
  }

    static async markNotificationClosed(wfhId) {
    return NotificationModel.updateMany(
      { relatedId: wfhId },
      { $set: { read: true, actions: [] } }
    );
  }

  static async getNotificationsByEmployee(employeeId) {
    return NotificationModel.find({ employeeId }).sort({ createdAt: -1 });
  }

  static async markAsRead(_id) {
    return NotificationModel.findByIdAndUpdate(_id, { read: true }, { new: true });
  }

  // Optional: mark all notifications for employee as read
  static async markAllAsRead(employeeId) {
    return await NotificationModel.updateMany(
      { employeeId },
      { read: true }
    );
  }
  
}

export default NotificationService;
