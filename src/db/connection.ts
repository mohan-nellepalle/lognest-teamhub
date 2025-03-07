
import mongoose from 'mongoose';
import { toast } from 'sonner';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worklog');
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    toast.error('Failed to connect to database');
    process.exit(1);
  }
};

export default connectDB;
