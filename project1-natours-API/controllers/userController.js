const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

exports.updateUser = handlerFactory.updateOneById(User);

exports.deleteUser = handlerFactory.deleteOneById(User);

exports.getAllUsers = handlerFactory.getAll(User);

exports.getUser = handlerFactory.getOneById(User);
