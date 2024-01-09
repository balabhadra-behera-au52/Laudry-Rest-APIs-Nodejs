/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/find/:id', userController.findUserById);
router.get('/all', userController.getAllUsers);
router.patch('/update/:id', userController.updateUserById);
router.post('/newaddress/:id', userController.addNewAddress);
router.get('/addresses/:id', userController.getAllAdressesByUserId);
router.post('/rating/:id', userController.rateOrder);
router.post('/runnerrating/:id', userController.rateRunnerOrderByOrderId);

module.exports = router; 
 