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
      set: (value) => Math.round(value * 10) / 10,
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
      // validate: {
      //   validator: function (val) {
      //     return val < this.price;
      //   },
      //   message: `Discount price ({VALUE}) should be the less than the regular price ${this.price}`,
      // },
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
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        required: [true, 'You must provide location coordinates'],
      },
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    tourGuides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
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
// tourSchema.pre('aggregate', function (next) {
//   if (!this._pipeline[0].$geoNear) {
//     this._pipeline.unshift({ secretTour: { $ne: true } });
//   }
//   // console.log(this._pipeline);
//   next();
// });
tourSchema.pre('aggregate', function (next) {
  // Check if the first stage is $geoNear
  if (this.pipeline()[0]?.$geoNear) {
    // Append the $match stage after $geoNear
    this.pipeline().splice(1, 0, { $match: { secretTour: { $ne: true } } });
  } else {
    // Otherwise, add $match at the beginning
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  }
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
