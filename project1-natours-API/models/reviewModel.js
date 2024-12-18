const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const reviewSchema = new mongoose.Schema(
  {
    reviewText: {
      type: String,
      required: [true, 'Review content is required'],
    },
    rating: {
      type: Number,
      required: true,
      validate: {
        validator: function (rating) {
          return rating % 0.5 === 0;
        },
        message: 'Rating must be multiple of 0.5',
      },
      max: 5,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      immutable: true,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'tour', select: 'name' }).populate({ path: 'user', select: 'name role' });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
