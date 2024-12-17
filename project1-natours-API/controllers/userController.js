const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.updateUserData = catchAsync(async (req, res, next) => {
  // Get the user from collection
  const user = await User.findById(req.user._id).select('+password');
  // Check if posted current password is correct
  if (!req.body.password || !user.checkPassword(req.body.password, user.password))
    return next(new AppError('The current password provided is wrong. Please try again.', 401));
  // If so, update the fields
  user.name = req.body.name;
  user.email = req.body.email;
  user.photo = req.body.photo;
  await user.save();

  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;

  // Send back response with updated User
  res.status(200).json({
    status: 'success',
    user: sanitizedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false,  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// exports.getAllUsers = catchAsync(async (req, res) => {
//   const users = await User.find();

//   res.status(201).json({
//     status: 'success',
//     data: users,
//   });
// });

// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
