const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name required'],
      unique: true,
      maxLength: [40, 'A Tour name must have at most 40 characters'],
      minLength: [5, 'A Tour name must have at least 5 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, 'Tour duration required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour max group size required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour dificulty required'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must be at most 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour price required'],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be the less than the price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour summary required'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour image required'],
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware to add a slug
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query Middleware to not show secret tours
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
// Query middleware to log query runtime
tourSchema.post(/^find/, function (docs, next) {
  // eslint-disable-next-line no-console
  console.log('Query took', Date.now() - this.start, 'miliseconds');
  // console.log(docs);
  next();
});

// Aggregate middleware
tourSchema.pre('aggregate', function (next) {
  this._pipeline.unshift({ $secretTour: { $ne: true } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
