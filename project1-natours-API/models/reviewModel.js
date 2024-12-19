const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Tour = require('./tourModel');

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

// Prevent users from creating more than one review on each tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name role' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: { _id: '$tour', nRating: { $sum: 1 }, avgRating: { $avg: '$rating' } },
    },
  ]);
  if (stats.length === 0) {
    stats.push({ nRating: 0, avgRating: 0 });
  }
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

// Middleware to update statistics upon creating new reviews
reviewSchema.post('save', function () {
  // note: this points to current review, so this.constructor points to the future Model itself, even though it has not yet been crated.
  this.constructor.calcAverageRatings(this.tour);
});

// Middleware to update statistics upon updating or deleting reviews
// 1st middleware to store the document on the query object
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
// On the post middleware, get the document tour id, and calculate the stats
reviewSchema.post(/^findOneAnd/, async function () {
  this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
