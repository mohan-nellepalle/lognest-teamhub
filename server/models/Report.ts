
import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  name: string;
  type: 'Project' | 'User' | 'Team' | 'Time';
  filters: {
    startDate?: Date;
    endDate?: Date;
    users?: mongoose.Types.ObjectId[];
    projects?: mongoose.Types.ObjectId[];
    teams?: mongoose.Types.ObjectId[];
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  name: {
    type: String,
    required: [true, 'Please provide a report name'],
    trim: true,
    maxlength: [100, 'Report name cannot be more than 100 characters']
  },
  type: {
    type: String,
    enum: ['Project', 'User', 'Team', 'Time'],
    required: [true, 'Please provide a report type']
  },
  filters: {
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    projects: [{
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }],
    teams: [{
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  }
}, { 
  timestamps: true 
});

const Report = mongoose.model<IReport>('Report', ReportSchema);

export default Report;
