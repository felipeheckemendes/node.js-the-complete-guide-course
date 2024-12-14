const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
// prettier-ignore
router
    .post('/signup', authController.signUp);

// prettier-ignore
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

// prettier-ignore
router
    .route('/id:')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
