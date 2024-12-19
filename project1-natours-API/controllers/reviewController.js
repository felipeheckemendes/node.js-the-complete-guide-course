const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
  //   Allow nested routes (or manual specification)
  if (!req.body.tour) req.body.tour = req.params.tourId;

  const review = await Review.create({
    reviewText: req.body.reviewText,
    rating: +req.body.rating,
    tour: req.body.tour,
    user: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.getReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOneById(Review);
exports.deleteReview = handlerFactory.deleteOneById(Review, { requireOwnership: true });
exports.updateReview = handlerFactory.updateOneById(Review, { requireOwnership: true });
