const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operation error (trusted)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or another unknow error: don't leak error details
    console.error('ERROR 🧨', err); // Log the error
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, err.statusCode);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.errmsg.match(/(?<=(["']\b))(?:(?=(\\?))\2.)*?(?=\1)/)}. Please use another value.`;
  return new AppError(message, err.statusCode);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, err.statusCode);
};

const handleJsonWebTokenError = () => {
  return new AppError('Invalid Token. Please log in again.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Token Expired. Please log in again.', 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (err.name === 'CastError') {
      // Handle cast error (mongoose) to display meaningful message
      error = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      // Handle duplicate values error (11000 Mongo error code)
      error = handleDuplicateFieldsDB(err);
    }
    if (err.name === 'ValidationError') {
      // Handle validation error (mongoose)
      error = handleValidationErrorDB(err);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError(err);
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(err);
    }
    sendErrorProd(error, res);
  }
};
