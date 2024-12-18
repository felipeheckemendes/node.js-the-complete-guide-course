const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// prettier-ignore
router
    .route('/')
    .get(authController.protect, reviewController.getReviews)
    .post(authController.protect, reviewController.createReview)

module.exports = router;
