const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

exports.getAllTours = handlerFactory.getAll(Tour);

exports.getTour = handlerFactory.getOneById(Tour, [
  {
    path: 'tourGuides',
    select: '-__v -passwordpasswordResetExpires -passwordResetToken -passwordResetExpires',
  },
  { path: 'reviews' },
]);

exports.createTour = handlerFactory.createOne(Tour);

exports.updateTour = handlerFactory.updateOneById(Tour, { requireOwnership: false });

exports.deleteTour = handlerFactory.deleteOneById(Tour, { requireOwnership: false });

exports.getTourStatistics = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const toursByMonth = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numStartingTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numStartingTours: -1 },
    },
    // {
    //   $limit: 3,
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: { toursByMonth },
  });
});
