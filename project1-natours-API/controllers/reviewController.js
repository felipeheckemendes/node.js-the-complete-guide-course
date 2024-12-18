const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');

exports.getReviews = catchAsync(async (req, res, next) => {
  let criteria;
  if (req.params.tourId) criteria = { tour: req.params.tourId };
  const reviews = await Review.find(criteria);
  res.status(200).json({
    status: 'success',
    data: { reviews },
  });
});

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
