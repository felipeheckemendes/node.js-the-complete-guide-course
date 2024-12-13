const express = require('express');
const path = require('path');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
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
// Handle unrouted urls
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
// Error handling middleware
app.use(globalErrorHandler); // CLASS NOTE: If you pass a function with 4 params to use, it will automatically recognize it as an error handling middleware, and will forward all errors to this middleware.

module.exports = app;
