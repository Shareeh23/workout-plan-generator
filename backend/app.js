require('dotenv').config();
require('./config/passport');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const { WorkoutGenerationError } = require('./utils/errors');

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workout');
const nutritionRoutes = require('./routes/nutrition');

const app = express();

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 5000;

app.use(passport.initialize());

app.use(
  cors({
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json()); // Important for parsing incoming JSON bodies

// Fallback manual CORS configuration in case `cors()` middleware causes issues

/* app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}); */

app.use('/auth', authRoutes);
app.use('/workout', workoutRoutes);
app.use('/nutrition', nutritionRoutes);

// Enhanced error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof WorkoutGenerationError) {
    return res.status(502).json({
      status: 'error',
      message: 'Workout generation failed',
      details: error.details,
    });
  }

  // Pass to default error handler
  next(error);
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
