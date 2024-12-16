const express = require('express');
// const userController = require('../controllers/userControllerold');
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
