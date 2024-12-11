const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');

const sendErrorResponse = (res, err, code) => {
  res.status(code).json({
    status: 'fail',
    error: err.message,
  });
  console.log('🧨🧨', err);
};

exports.aliasTopTours = (req, res, next) => {
  console.log('HERE WE ARE ');
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  console.log(req.query);
  next();
};

exports.getAllTours = async (req, res) => {
  console.log('Is the request updated?', req.query);
  try {
    // Query
    const toursQuery = new APIFeatures(Tour.find(), req.query).filter().sort().limit().pagination();
    console.log('TOURS QUERY: ', toursQuery);
    const toursData = await toursQuery.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: toursData.length,
      data: { toursData },
    });
  } catch (err) {
    sendErrorResponse(res, err, 404);
  }
};

exports.getTour = async (req, res) => {
  try {
    const tourData = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour: tourData },
    });
  } catch (err) {
    sendErrorResponse(res, err, 404);
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    sendErrorResponse(res, err, 400);
  }
};

exports.updateTour = async (req, res) => {
  try {
    console.log(req.body);
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    sendErrorResponse(res, err, 400);
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    sendErrorResponse(res, err, 400);
  }
};

exports.getTourStatistics = async (req, res, next) => {
  try {
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
  } catch (err) {
    sendErrorResponse(res, err, 400);
  }
};

exports.getMonthlyPlan = async (req, res, next) => {
  try {
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
  } catch (err) {
    sendErrorResponse(res, err, 400);
  }
};
