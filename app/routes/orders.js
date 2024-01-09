const express = require('express');
const router = express.Router();
const ordersController = require("../controllers/orders.controller")
const verifyOrderPermissionToken =require('../middlewares/verifyOrderPermissionToken');
const verifyUserToken =require('../middlewares/verifyUserToken');

router.post("/new/:id",verifyUserToken,ordersController.newOrder)
router.get("/find/:id",verifyOrderPermissionToken,ordersController.findOrderByOrderId)
router.get("/user/:id",verifyUserToken,ordersController.findOrdersByUserId)
router.patch("/update/:id",verifyOrderPermissionToken,ordersController.UpdateByOrderId)

module.exports = router;