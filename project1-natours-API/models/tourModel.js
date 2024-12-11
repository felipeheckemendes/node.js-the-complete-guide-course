const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name required'],
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
