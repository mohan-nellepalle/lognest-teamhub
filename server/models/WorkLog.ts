
import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkLog extends Document {
  userId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  description: string;
  timeSpent: number; // in minutes
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WorkLogSchema = new Schema<IWorkLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Please provide a task ID']
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Please provide a project ID']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  timeSpent: {
    type: Number,
    required: [true, 'Please provide time spent'],
    min: 1
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

const WorkLog = mongoose.model<IWorkLog>('WorkLog', WorkLogSchema);

export default WorkLog;
