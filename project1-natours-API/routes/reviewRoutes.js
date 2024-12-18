const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const handlerFactory = require('../controllers/handlerFactory');
const Review = require('../models/reviewModel');

const router = express.Router({ mergeParams: true });

// prettier-ignore
router
    .route('/')
    .get(authController.protect, reviewController.getReviews)
    .post(authController.protect, reviewController.createReview)

// prettier-ignore
router
    .route('/:id')
    .delete(authController.protect, reviewController.deleteReview)

module.exports = router;
