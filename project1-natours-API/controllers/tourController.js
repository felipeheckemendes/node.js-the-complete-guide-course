const Tour = require('../models/tourModel');

const sendErrorResponse = (res, err, code) =>
  res.status(code).json({
    status: 'fail',
    error: err.message,
  });

exports.getAllTours = async (req, res) => {
  try {
    // 1. Filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    excludedFields.forEach((element) => delete queryObj[element]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let toursQuery = Tour.find(JSON.parse(queryStr));

    // 2. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      toursQuery = toursQuery.sort(sortBy);
    } else {
      toursQuery = toursQuery.sort('-createdAt _id');
    }

    // 3. Field limiting
    if (req.query.fields) {
      const selectedFields = req.query.fields.split(',').join(' ');
      toursQuery = toursQuery.select(selectedFields);
    } else {
      toursQuery = toursQuery.select('-__v');
    }

    // 4. Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;
    toursQuery = toursQuery.limit(limit).skip(skip);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // Await query
    const toursData = await toursQuery;

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
