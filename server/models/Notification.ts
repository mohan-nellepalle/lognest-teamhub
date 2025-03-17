
import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  message: string;
  relatedTo: {
    type: 'Project' | 'Task' | 'Team' | 'WorkLog';
    id: mongoose.Types.ObjectId;
  };
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  },
  type: {
    type: String,
    required: [true, 'Please provide a notification type']
  },
  message: {
    type: String,
    required: [true, 'Please provide a notification message'],
    maxlength: [200, 'Message cannot be more than 200 characters']
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['Project', 'Task', 'Team', 'WorkLog'],
      required: [true, 'Please provide a related type']
    },
    id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide a related ID']
    }
  },
  read: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
