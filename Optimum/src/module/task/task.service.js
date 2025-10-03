import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import TaskModel from "../task/task.model.js";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

class TaskService {
  static async createTask(taskData) {
    const bucketName = process.env.AWS_S3_BUCKET;

    // Upload files to S3 if provided
    const attachments = await Promise.all(
      (taskData.files || []).map(async (file) => {
        const fileKey = `tasks/${uuidv4()}-${file.originalname}`;

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: file.buffer, // multer memoryStorage gives buffer
          ContentType: file.mimetype,
        });

        await s3.send(command);

        return {
          fileName: file.originalname,
          filePath: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        };
      })
    );

    // Remove files before saving
    const { files, ...rest } = taskData;

    // Save task in MongoDB
    const task = new TaskModel({
      ...rest,
      attachments,
    });

    return await task.save();
  }

  static async updateTaskStatus(id, status) {
    return await TaskModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  static async getAllTasks() {
    return await TaskModel.find();
  }

  static async updateTask(_id, updateData) {
    return await TaskModel.findOneAndUpdate(
      { _id },
      { $set: updateData },
      { new: true }
    );
  }
}

export default TaskService;
