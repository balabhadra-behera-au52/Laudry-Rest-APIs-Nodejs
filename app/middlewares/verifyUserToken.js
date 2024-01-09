const jwt = require('jsonwebtoken');
const keys = require('../utils/config/index');
const userModel = require('../models/userSchema');
const __res_ = require('../utils/helpers/send-response');
const ObjectId = require('mongoose').Types.ObjectId;
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
        const user = await userModel.findOne({ _id: decodedToken._id, Phone: decodedToken.Phone });
        req.user = user;
    } catch (err) {
        console.log(err.message);
        return __res_.out(req, res, {
            status: true,
            statusCode: 401,
            message: "Unauthorized user",
            data: 'Authorization failed. Invalid token.'
        });
    }

    next();
};