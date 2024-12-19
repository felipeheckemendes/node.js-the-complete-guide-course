const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/APIFeatures');

exports.deleteOneById = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    let doc;
    if (options.requireOwnership && req.user.role !== 'admin') {
      doc = await Model.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      if (!doc) {
        return next(new AppError('You are not authorized to delete this document', 403));
      }
    } else {
      doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOneById = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    // Validate the existance of data on the body
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError('Request body is empty. Provide data to update.', 400));
    }

    let doc;
    if (options.requireOwnership && req.user.role !== 'admin') {
      doc = await Model.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) {
        return next(
          new AppError(
            'You are not authorized to update this document or no document was found with provided ID',
            403,
          ),
        );
      }
    } else {
      doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOneById = (Model, populateOptions = []) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    populateOptions.forEach((option) => {
      query = query.populate(option);
    });
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No document found with that ID: ${req.params.id}`), 404);
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, populateOptions = []) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on Tours
    let criteria;
    if (req.params.tourId) criteria = { tour: req.params.tourId };
    // Query
    const features = new APIFeatures(Model.find(criteria), req.query)
      .filter()
      .sort()
      .limit()
      .pagination();
    // eslint-disable-next-line prefer-destructuring
    let query = features.query;
    populateOptions.forEach((option) => {
      query = query.populate(option);
    });
    const docs = await query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
