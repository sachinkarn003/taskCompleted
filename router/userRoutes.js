const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();

router.route('/signup').post(authController.singup);
router.route('/login').post(authController.login);

router.route('/').get(authController.protect,authController.restrictTo('admin'),authController.getAllUsers);
module.exports = router