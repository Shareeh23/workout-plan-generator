const path = require('path');
require('dotenv').config();
require('./config/passport');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { WorkoutGenerationError } = require('./utils/errors');

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workout');
const nutritionRoutes = require('./routes/nutrition');
const adminRoutes = require('./routes/admin');

const app = express();

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 5000;

// Admin rate limiting
const adminLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 100,
  message: 'Too many requests from this IP',
  skip: req => !req.path.startsWith('/admin')
});

app.use(passport.initialize());

app.use(adminLimiter);

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  })
);

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

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Content-Disposition', 'inline');
    // Prevent content sniffing
    res.set('X-Content-Type-Options', 'nosniff');
  }
}));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
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
  const message = error.message || 'Internal Server Error';
  const data = error.data;
  res.status(status).json({ statusCode: status, message: message, data: data });
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
