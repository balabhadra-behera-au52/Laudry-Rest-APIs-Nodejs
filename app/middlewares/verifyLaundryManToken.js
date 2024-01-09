const jwt = require('jsonwebtoken');
const keys = require('../utils/config/index');
const serviceManModel = require('../models/serviceMan')
const __res_ = require('../utils/helpers/send-response');

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
        const user = await serviceManModel.findOne({ _id: decodedToken._id, Email: decodedToken.Email, Role: "LaundryMan" });
        req.user = user;
    } catch (err) {
        console.log(err.message)
        return __res_.out(req, res, {
            status: true,
            statusCode: 401,
            message: "Unauthorized user",
            data: 'Authorization failed. Invalid token.'
        });
    }

    next();
};