const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const sanitizeRequestBody = require('../utils/sanitizeRequestBody');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

const allowedFields = [
  'name',
  'duration',
  'maxGroupSize',
  'difficulty',
  'price',
  'discount',
  'summary',
  'description',
  'imageCover',
  'images',
  'startDates',
  'secretTour',
  'startLocation',
  'locations',
  'tourGuides',
  'secretTour',
  'startDates',
];

// prettier-ignore
router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        sanitizeRequestBody(allowedFields),
        tourController.createTour
    );
// prettier-ignore
router
    .route('/top-5-tours')
    .get(tourController.aliasTopTours)
// prettier-ignore
router
    .route('/tour-stats')
    .get(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.getTourStatistics)
// prettier-ignore
router
    .route('/monthly-plan/:year')
    .get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan)
// prettier-ignore
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin)
// prettier-ignore
router
    .route('/toursDistances/:latlng/unit/:unit')
    .get(tourController.getToursDistance)
// prettier-ignore
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        sanitizeRequestBody(allowedFields), 
        tourController.updateTour
    )
    .delete(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.deleteTour);

module.exports = router;
