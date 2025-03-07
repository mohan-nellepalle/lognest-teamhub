
import dotenv from 'dotenv';
import app from './index';

// Load environment variables
dotenv.config();

// Define port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

// If this file is run directly, start the server
if (require.main === module) {
  startServer();
}

export default startServer;
