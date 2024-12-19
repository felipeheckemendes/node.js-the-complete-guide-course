const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// prettier-ignore
router.route('/')
    .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers);

// prettier-ignore
router
  .route('/:id')
  .get(authController.protect, authController.restrictTo('admin'), userController.getUser)
  .patch(authController.protect, authController.restrictTo('admin'), userController.updateUser)
  .delete(authController.protect, authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
