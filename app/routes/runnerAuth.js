const express = require('express')
const router = express.Router();
const runnerController = require('../controllers/runner.controller');

router.post('/create', runnerController.createRunner)
router.post('/login', runnerController.runnerLogin);

module.exports = router;