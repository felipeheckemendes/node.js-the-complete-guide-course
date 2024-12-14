const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username is required'],
    maxLength: 50,
    minLength: 4,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  photo: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A password confirmation is required'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
    },
  },
});

// Password encryptioion
userSchema.pre('save', async function (req, res, next) {
  if (!this.isModified('password')) return next(); // Only run theencryption if the password was modified. If not, return to the next middleware.
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // After checking if both are the same, it is no longer necessary to store the Confirm
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
