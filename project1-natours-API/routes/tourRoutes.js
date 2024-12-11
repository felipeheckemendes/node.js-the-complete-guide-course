const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// prettier-ignore
router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);
// prettier-ignore
router
    .route('/top-5-tours')
    .get(tourController.aliasTopTours)
    .get(tourController.getAllTours)
// prettier-ignore
router
    .route('/tour-stats')
    .get(tourController.getTourStatistics)
// prettier-ignore
router
    .route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan)
// prettier-ignore
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);
module.exports = router;
