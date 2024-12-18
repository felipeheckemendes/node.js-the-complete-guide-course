const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
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
