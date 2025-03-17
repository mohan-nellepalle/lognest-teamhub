
import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  status: 'Not Started' | 'Just Started' | 'In Progress' | 'Almost Complete' | 'Completed';
  type: string;
  deadline: Date;
  progress: number;
  team: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['Not Started', 'Just Started', 'In Progress', 'Almost Complete', 'Completed'],
    default: 'Not Started'
  },
  type: {
    type: String,
    required: [true, 'Please provide a project type'],
    trim: true
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline']
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  team: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  }
}, { 
  timestamps: true 
});

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
