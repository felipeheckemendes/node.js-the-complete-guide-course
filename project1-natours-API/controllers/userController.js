const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

exports.updateUser = handlerFactory.updateOneById(User);

exports.deleteUser = handlerFactory.deleteOneById(User);

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(201).json({
    status: 'success',
    data: users,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findOneById(req.params.id);

  res.status(201).json({
    status: 'success',
    data: user,
  });
});
