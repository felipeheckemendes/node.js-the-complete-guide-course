const express = require('express');
const path = require('path');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Starting App
const app = express();

// MIDDLEWARES
// Morgan Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Parse request body
app.use(express.json());
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Add date-time to request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
