
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import app from '../index';

// Load environment variables
dotenv.config();

// Define port
const PORT = process.env.PORT || 5000;

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Assume the build is in the 'dist' directory (standard for Vite)
  app.use(express.static(path.join(__dirname, '../../../dist')));
  
  // Handle any requests that don't match the API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
