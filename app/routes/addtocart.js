const addtocartController = require("../controllers/addtocart.controller");
const express = require("express");
const router = require("./user");
const Router = express.Router

router.post('/addtocart/:id',addtocartController.createaddtocart);

module.exports = router;
