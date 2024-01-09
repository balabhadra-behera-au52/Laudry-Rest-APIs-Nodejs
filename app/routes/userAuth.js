/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/otp/', userController.sendOtpToUser);
router.post('/create/:id',userController.createUser);
// router.post('/login/:id', userController.userLogin);


module.exports = router; 