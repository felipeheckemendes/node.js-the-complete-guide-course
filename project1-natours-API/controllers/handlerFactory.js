const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOneById = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    let doc;
    if (options.requireOwnership) {
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
