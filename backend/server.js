const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/scholarships', scholarshipRoutes);

// --- Deployment Configuration ---
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend build folder
  app.use(express.static(path.join(__dirname, '../../build')));
  // Handle any other requests with React's index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../../build', 'index.html'))
  );
} else {
  // Simple route for testing in development
  app.get('/', (req, res) => {
    res.send('API for Login/Signup and Scholarships is running in development mode...');
  });
}

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});