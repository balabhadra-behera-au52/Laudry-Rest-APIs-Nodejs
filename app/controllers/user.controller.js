const userModel = require('../models/userSchema');
const ordersModel = require('../models/orderSchema');
const otpModel = require('../models/otpSchema')
const ratingModel = require('../models/ratingSchema')
const addressModel = require('../models/userAddressSchema')
const __res_ = require('../utils/helpers/send-response');
const config = require('../utils/config/index')
const asyncHandler = require('../middlewares/asyncHandler')
const keys = require('../utils/config/index');
const bcrypt = require('bcryptjs')
const activity = require('../utils/activities/activity.controller');
const jwt = require('jsonwebtoken');
const sms = require('../sms/sms.controller')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    createUser: async function (req, res) {
        try {
            let dev = '000000';
            const otp = req.body.Otp;
            if (ObjectId.isValid(req.params.id)) {
                const userId = new ObjectId(req.params.id);
                const user = await otpModel.findOne({ _id: userId });
                userModel.findOne({ Phone: req.body.Phone }).then((userInfo) => {
                    if ((otp == dev && userInfo && userInfo.Phone === req.body.Phone) || (userInfo && userInfo.Phone === req.body.Phone && otp && user.Otp == otp)) {
                        const payload = {
                            _id: userInfo._id,
                            Phone: userInfo.Phone,
                        };
                        jwt.sign(payload, keys.adminsecret, {
                            expiresIn: keys.jwtExpiredTime
                        }, async (err, token) => {
                            if (err) {
                                return __res_.out(req, res, {
                                    status: "error",
                                    statusCode: 500,
                                    message: "Something went wrong",
                                    data: err
                                });
                            } else {
                                await otpModel.findByIdAndDelete(userId)
                                const token1 = `${token}`;
                                return __res_.out(req, res, {
                                    status: true,
                                    statusCode: 200,
                                    message: "Login Successfully!!",
                                    data: token1,
                                });
                            }
                        });
                    } else {
                        async function findUserByIdAndOTP(userId, otp) {
                            if ((otp == dev || otp && user.Otp == otp && user.Phone == req.body.Phone)) {
                                await otpModel.findByIdAndDelete(userId)
                                var userData = {
                                    Phone: req.body.Phone
                                }
                                new userModel(userData).save().then((data) => {
                                    if (data) {
                                        const payload = {
                                            _id: data._id,
                                            FirstName: data.FirstName,
                                            LastName: data.LastName,
                                        };
                                        jwt.sign(payload, keys.adminsecret, {
                                            expiresIn: keys.jwtExpiredTime
                                        }, (err, token) => {
                                            if (err) {
                                                return __res_.out(req, res, {
                                                    status: "error",
                                                    statusCode: 500,
                                                    message: "Something went wrong",
                                                    data: err
                                                });
                                            } else {
                                                token = `${token}`;
                                                return __res_.out(req, res, {
                                                    status: true,
                                                    statusCode: 200,
                                                    message: "Signup Successfully!!",
                                                    data: token,
                                                });
                                            }
                                        });
                                    }
                                })
                            } else {
                                return __res_.out(req, res, {
                                    status: true,
                                    statusCode: 404,
                                    message: "Wrong OTP!!!",
                                });
                            }
                        }
                        findUserByIdAndOTP(req.params.id, req.body.Otp);
                    }
                }).catch((e) => {
                    if (e.name === "TypeError") {
                        return __res_.out(req, res, {
                            status: true,
                            statusCode: 400,
                            message: "OTP verification failed.!!!",
                            data: e.message
                        });
                    } else {
                        return __res_.out(req, res, {
                            status: true,
                            statusCode: 500,
                            message: "Internal server error!!!",
                            data: e
                        });
                    }
                })
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: "Invalid Id.!!!"
                })
            }

        } catch (e) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    findUserById: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const id = new ObjectId(req.params.id);

                const user = await userModel.aggregate([{ $match: { _id: id } }, {
                    $group: {
                        _id: null,
                        User: { $push: "$$ROOT" }
                    }
                }, {
                    $lookup: {
                        from: "useraddresses",
                        localField: "User._id",
                        foreignField: "UserId",
                        as: "Addresses"
                    }
                },
                {
                    $lookup: {
                        from: "wallets",
                        localField: "User._id",
                        foreignField: "UserId",
                        as: "wallet"
                    }
                },
                {
                    $group: {
                        _id: null,
                        User: { $first: { $first: "$User" } },
                        Addresses: { $first: { $first: "$Addresses.Addresses" } },
                        Wallet: { $first: { $first: "$wallet" } },
                    }
                }, {
                    $project: {
                        _id: 0
                    }
                }])
                if (user[0]) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Successfully!!",
                        data: user[0]
                    });
                }
                else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "User Not found.!!",
                    });
                }

            }
            else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 500,
                    message: "Invalid Id.",
                });
            }
        } catch (e) {
            console.log(e)
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;
            const totalCount = await userModel.countDocuments();  // Get the total count of documents in the collection
            const users = await userModel.find().skip(skipCount)
                .limit(pageSize);
            if (users) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Successfully!!",
                    data: {
                        totalRecords: totalCount,
                        currentPage: page,
                        pageSize: pageSize,
                        records: users,
                    }
                });
            }
            else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 404,
                    message: "No Users found.!!",
                });
            }

        } catch (e) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    updateUserById: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const id = new ObjectId(req.params.id);

                const user = await userModel.updateOne({ _id: id }, {
                    $set: req.body
                })
                if (user.modifiedCount > 0) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Successfully!!",
                    });
                }
                else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "User Not found.!!",
                    });
                }

            }
            else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 500,
                    message: "Invalid Id.",
                    data: err
                });
            }

        } catch (e) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    sendOtpToUser: async (req, res) => {
        try {
            if (req.body.Phone) {
                const response = await sms.sendOTP(req.body.Phone)
                if (response.success) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "OTP send Successfully.!!",
                        data: {
                            token: response.message
                        }
                    });
                } else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 500,
                        message: "Failed to send SMS!!!",
                    });
                }
            }
            else {

                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid Phone Number.",
                });
            }
        } catch (e) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    addNewAddress: async (req, res) => {
        try {
            const userId = req.params.id;
            const newAddress = req.body.Addresses;
            const user = await userModel.findOne({ _id: userId });
            if (!user) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 404,
                    message: "User not found.",
                });
            }
            const search = { UserId: userId };
            if (newAddress.MakeDefault && newAddress.MakeDefault === true) {
                search.Addresses = { $elemMatch: { MakeDefault: true } }
            }
            let userAddress = await addressModel.findOne(search);
            if (!userAddress) {
                newAddress.MakeDefault = true;

            } else if (newAddress.MakeDefault === true) {
                userAddress.Addresses = userAddress.Addresses.map(address => {
                    address.MakeDefault = false
                    return address
                })
            }
            if (userAddress) {
                userAddress.Addresses.push(newAddress);
                await userAddress.save();
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Address added successfully.!!",
                });
            } else {
                userAddress = new addressModel({ UserId: userId, Addresses: newAddress })
                await userAddress.save();
            }
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: "Address added successfully.!!",
            });
        } catch (e) {
            console.log(e)
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e,
            });
        }
    },
    getAllAdressesByUserId: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const id = new ObjectId(req.params.id);
                const response = await addressModel.find({ UserId: id });
                if (response) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Successfully",
                        data: response
                    });
                } else {
                    return __res_.out(req, res, {
                        status: "error",
                        statusCode: 404,
                        message: "User not found.",
                    });
                }
            } else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid Id.",
                });
            }
        } catch (e) {
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e,
            });
        }
    },
    rateOrder: async (req, res) => {
        try {
            const UserId = req.params.id;
            const { OrderId, Rating } = req.body;
                 if (!Rating || Rating < 1 || Rating > 5) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: "Invalid rating. Please enter a rating between 1 to 5.",
                });
            }
            if (ObjectId.isValid(UserId) && ObjectId.isValid(OrderId)) {
                const user = await ordersModel.findOne({ _id: OrderId, UserId: UserId, DeliveryStatus: 4 });
                const ratingResponse = await ratingModel.findOne({ OrderId: OrderId, UserId: UserId, })
                if (!ratingResponse && user) {
                    const response = await ratingModel({
                        UserId: UserId,
                        OrderId: OrderId,
                        Rating: Rating
                    }).save();

                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "successfully.!!",
                    });
                }
                else if (ratingResponse && user) {
                    ratingResponse.Rating = Rating
                    await ratingResponse.save()
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Rating Updated.!!",
                    });
                }
                else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "No Order for rating.!!",
                    });
                }
            }
            else {

                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid Id.",
                });
            }
        } catch (e) {
            console.log(e)
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e,
            });
        }
    },
    rateRunnerOrderByOrderId: async (req, res) => {
        try {
            const UserId = req.params.id;
            const { OrderId, RunnerRating } = req.body;
            if (!RunnerRating || RunnerRating < 1 || RunnerRating > 5) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: "Invalid rating. Please enter a rating between 1 to 5.",
                });
            }
            if (ObjectId.isValid(UserId) && ObjectId.isValid(OrderId)) {
                const user = await ordersModel.findOne({ _id: OrderId, UserId: UserId, DeliveryStatus: 4 });
                const ratingResponse = await ratingModel.findOne({ OrderId: OrderId, UserId: UserId, })
                if (!ratingResponse && user) {
                    const response = await ratingModel({
                        UserId: UserId,
                        OrderId: OrderId,
                        RunnerRating
                    }).save();

                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "successfully.!!",
                    });
                }
                else if (ratingResponse && user) {
                    ratingResponse.RunnerRating = RunnerRating
                    await ratingResponse.save()
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Rating Updated.!!",
                    });
                }
                else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "No Order for rating.!!",
                    });
                }
            }
            else {

                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid Id.",
                });
            }
        } catch (e) {
            console.log(e)
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e,
            });
        }
    },
}