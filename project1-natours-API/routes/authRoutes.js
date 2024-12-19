const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
// prettier-ignore
router
    .route('/signup')
    .post(authController.signup)

// prettier-ignore
router
    .route('/login')
    .post(authController.login);

// prettier-ignore
router
    .route('/forgotPassword')
    .post(authController.forgotPassword)

// prettier-ignore
router
    .route('/resetPassword/:token')
    .patch(authController.resetPassword);

// prettier-ignore
router
    .route('/updatePassword')
    .patch(authController.protect, authController.updatePassword);

// prettier-ignore
router
    .route('/updateUserData')
    .patch(authController.protect, authController.updateUserData);

// prettier-ignore
router
    .route('/deleteUser')
    .delete(authController.protect, authController.softDeleteUser);

// prettier-ignore
router
    .route('/me')
    .get(authController.protect, authController.getMe);

module.exports = router;
