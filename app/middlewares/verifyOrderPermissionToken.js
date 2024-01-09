const userModel = require('../models/userSchema');
const ordersModel = require('../models/orderSchema');
const __res_ = require('../utils/helpers/send-response');
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');
const keys = require('../utils/config/index');

module.exports = async (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken) {
        return __res_.out(req, res, {
            status: true,
            statusCode: 401,
            message: "Unauthorized user",
            data: 'Authorization failed. No access token provided.'
        });
    }
    const token = authToken.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, keys.adminsecret);
        const user = await ordersModel.findOne({
            $or: [
                { UserId: decodedToken._id },
                { AssignedTo: decodedToken._id }
            ]
        });
        if (user) {
            req.user = user;
        }
        else {
            throw new Error('Username not found.');
        }

    } catch (err) {
        console.log(err)
        return __res_.out(req, res, {
            status: true,
            statusCode: 401,
            message: "Unauthorized user",
            data: 'Authorization failed. Invalid token.'
        });
    }

    next();
};