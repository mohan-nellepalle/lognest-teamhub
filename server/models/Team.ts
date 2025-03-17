
import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  leader: mongoose.Types.ObjectId;
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: [true, 'Please provide a team name'],
    trim: true,
    maxlength: [50, 'Team name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a leader ID']
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, { 
  timestamps: true 
});

const Team = mongoose.model<ITeam>('Team', TeamSchema);

export default Team;
