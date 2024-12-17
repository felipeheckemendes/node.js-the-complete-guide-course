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
    .patch(authController.protect, userController.updateUserData);

// prettier-ignore
router
    .route('/deleteUser')
    .delete(authController.protect, userController.deleteUser);

// // prettier-ignore
// router
//     .route('/')
//     .get(userController.getAllUsers)
//     .post(userController.createUser)

// // prettier-ignore
// router
//     .route('/id:')
//     .get(userController.getUser)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser)

module.exports = router;
