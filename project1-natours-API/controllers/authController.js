const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const createAndSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true, // This makes it impossible to modifiy the cookie except the browser, to prevent cross site attacks
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // Cookie is sent only on https
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    changedPasswordAfter: new Date(),
  });

  newUser.password = undefined;

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1. Check if email and password were sent
  if (!email || !password) {
    return next(AppError('Please provide an email address and password in order to login', 400));
  }
  // 2. Check if the user exists & password is correct
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 2.1 Check if user has been deleted
  // 3. Send token to user
  createAndSendToken(user, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Get the token and check if it exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access', 401));
  }
  // Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if user still exists
  const checkedUser = await User.findById(decoded.id).select('+active');
  if (!checkedUser || !checkedUser.active) {
    return next(new AppError('The user associated with this token does not exist'), 401);
  }
  // Check if user changed password after JWT was issued
  if (checkedUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The password you used to login is no longer valid. Please insert the new password.',
      ),
    );
  }

  req.user = checkedUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error('You do not have permission to perform this action', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with that email address', 404));
  // Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save();
  // Send token as email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetUrl}. If you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(new AppError('There was an error sending the email. Try again later', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken });
  // If token has not expired, and there is user, set the new password
  if (!user || user.passwordResetExpires < Date.now())
    return next(new AppError('Invalid or expired token. Please request new password reset.'));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // Update changedPasswordAt property
  user.changedPasswordAfter = Date.now() - 1000;
  await user.save();
  // Log in the user (send jwt)
  // Send token to user
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get the user from collection
  const user = await User.findById(req.user._id).select('+password');
  // Check if posted current password is correct
  if (!user.checkPassword(req.body.currentPassword, user.password))
    return next(new AppError('The current password provided is wrong. Please try again.', 401));
  // If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // Update changedPasswordAt property
  user.changedPasswordAfter = Date.now() - 1000;
  await user.save();
  createAndSendToken(user, 200, res);
});

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

exports.softDeleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const me = await User.findById(req.user._id);
  res.status(201).json({
    status: 'success',
    data: me,
  });
});
