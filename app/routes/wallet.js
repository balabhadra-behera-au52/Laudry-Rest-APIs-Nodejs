/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

router.post('/addmoney/:id',walletController.addMoneyToWalletByUserId);
router.post('/createcoupon/',walletController.createCoupon);

module.exports = router; 
 