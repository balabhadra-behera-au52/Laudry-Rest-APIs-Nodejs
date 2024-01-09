const express = require('express')
const router = express.Router();
const runnerController = require('../controllers/runner.controller');

router.get('/find/:id', runnerController.findRunnerById);
router.get('/all', runnerController.getAllRunners);
router.patch('/update/:id', runnerController.updateRunnerById);
router.get("/orders/:id",runnerController.getPickupOrdersForRunnerByRunnerId)
router.patch("/updateorder/:id",runnerController.updateOrderStatus)

module.exports = router;