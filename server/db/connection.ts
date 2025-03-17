
import mongoose from 'mongoose';
import { toast } from 'sonner';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/worklog';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions;
    
    const connection = await mongoose.connect(mongoUri, options);
    
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    
    // Only show toast in browser environment
    if (typeof window !== 'undefined') {
      toast.error('Failed to connect to database');
    }
    
    // In production, we might want to retry connection instead of exiting
    if (process.env.NODE_ENV === 'production') {
      console.error('Database connection failed, retrying in 5 seconds...');
      setTimeout(() => connectDB(), 5000);
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;
