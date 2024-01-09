const express = require('express')
const router = express.Router();
const laundryManController = require('../controllers/laundryMan.controller');

router.post('/create', laundryManController.createLaundryMan)
router.post('/login', laundryManController.laundryManLogin);
router.get('/find/:id', laundryManController.findLaundryManById);
router.get('/all', laundryManController.getAllLaundryMans);
router.patch('/update/:id', laundryManController.updateLaundryManById);
router.patch("/updateorder/:id",laundryManController.updateOrderStatus)

module.exports = router;