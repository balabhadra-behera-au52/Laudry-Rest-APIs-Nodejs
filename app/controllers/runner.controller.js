const vehicleModel = require('../models/vehicleSchema')
const serviceManModel = require('../models/serviceMan')
const ordersModel = require('../models/orderSchema');
const __res_ = require('../utils/helpers/send-response');
const config = require('../utils/config/index')
const asyncHandler = require('../middlewares/asyncHandler')
const keys = require('../utils/config/index');
const bcrypt = require('bcryptjs')
const activity = require('../utils/activities/activity.controller');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    createRunner: async function (req, res) {
        try {
            const password = req.body.Password;
            const newPassword = bcrypt.hashSync(password, keys.saltRounds);
            serviceManModel.findOne({ Role: "Runner", Email: req.body.Email }).then((runnerInfo) => {
                if (runnerInfo) {
                    return __res_.out(req, res, {
                        status: "found",
                        statusCode: 200,
                        message: "Runner Already Exit!!.",
                    })
                } else {
                    var runnerData = {
                        FirstName: req.body.FirstName,
                        LastName: req.body.LastName,
                        Email: req.body.Email,
                        Phone: req.body.Phone,
                        Password: newPassword,
                        Role: "Runner",
                        Address: req.body.Address,
                        DateOfBirth: req.body.DateOfBirth,
                        CurrentLocation: req.body.CurrentLocation,
                        LastActive: new Date(),
                        ActivityStatus: req.body.ActivityStatus
                    }

                    new serviceManModel(runnerData).save().then((data) => {
                        if (data) {
                            new vehicleModel({
                                RunnerId: data._id,
                                VehicleType: req.body.VehicleType,
                                VehicleNumber: req.body.VehicleNumber,
                            }).save();

                            const payload = {
                                _id: data._id,
                                Email: data.Email,
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
                                        message: "Singup Successfully!!",
                                        data: token,
                                    });
                                }
                            });
                        }
                    })
                }
            })
        } catch (e) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    // Will authenticate the runner with email and password
    runnerLogin: function (req, res, next) {
        serviceManModel.findOne({
            Role: "Runner",
            Email: req.body.Email
        }).then((runnerInfo) => {
            if (!runnerInfo) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 404,
                    message: "Runner Does Not Exit!!",
                })
            } else if (req.body.Email === runnerInfo.Email && (bcrypt.compareSync(req.body.Password, runnerInfo.Password))) {
                console.log('hi')
                const payload = {
                    _id: runnerInfo._id,
                    Email: runnerInfo.Email,
                    FirstName: runnerInfo.FirstName,
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
                        token1 = `${token}`;
                        return __res_.out(req, res, {
                            status: true,
                            statusCode: 200,
                            message: "Login Successfully!!",
                            data: token1,
                        });
                    }
                });
            } else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 401,
                    message: "Invalid Credentials"
                });
            }
        }

        ).catch((err) => {
            return __res_.out(req, res, {
                status: "error",
                statusCode: 500,
                data: err
            });
        });
    },
    findRunnerById: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const id = new ObjectId(req.params.id);

                const runner = await serviceManModel.findOne({ _id: id, Role: "Runner" }, { Password: 0 })
                if (runner) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Successfully!!",
                        data: runner,
                    });
                }
                else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "Runner Not found.!!",
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
    getAllRunners: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;
            const totalCount = await serviceManModel.find({ Role: "Runner" }).countDocuments();  // Get the total count of documents in the collection
            const runners = await serviceManModel.find({ Role: "Runner" },{Password:0}).skip(skipCount)
                .limit(pageSize);
            if (runners) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Successfully!!",
                    data: {
                        totalRecords: totalCount,
                        currentPage: page,
                        pageSize: pageSize,
                        records: runners,
                    }
                });
            }
            else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 404,
                    message: "No Runners found.!!",
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
    updateRunnerById: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const id = new ObjectId(req.params.id);
                const { Phone, Password, ...updateFields } = req.body;

                const runner = await serviceManModel.updateOne({ _id: id, Role: "Runner" }, {
                    $set: updateFields
                })
                if (runner.modifiedCount > 0) {
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
                        message: "Runner Not found.!!",
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
    getPickupOrdersForRunnerByRunnerId: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const id = new ObjectId(req.params.id);
                const response = await ordersModel.find({ AssignedTo: id });
                if (response.lenth > 0) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Get All Orders Successfully",
                        data: response
                    });
                } else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "No Orders.",
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
    updateOrderStatus: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id) && ObjectId.isValid(req.body.OrderId)) {
                const id = new ObjectId(req.params.id);
                const order = req.body;
                const status = await ordersModel.findOne({ _id: order.OrderId, AssignedTo: id });
                if (status.DeliveryStatus == 0 && order.DeliveryStatus === 1) {
                    const response = await ordersModel.updateOne({ _id: order.OrderId, AssignedTo: id }, {
                        $set: {
                            DeliveryStatus: order.DeliveryStatus
                        }
                    });
                    if (response && response.modifiedCount === 1) {
                        return __res_.out(req, res, {
                            status: "success",
                            statusCode: 200,
                            message: "Successfully updated.",
                        });
                    }
                    else {
                        return __res_.out(req, res, {
                            status: false,
                            statusCode: 500,
                            message: "Internal server error!!!",
                            data: e,
                        });
                    }
                }
                else if (status.DeliveryStatus == 2 && order.DeliveryStatus === 3) {
                    const response = await ordersModel.updateOne({ _id: order.OrderId, AssignedTo: id }, {
                        $set: {
                            DeliveryStatus: order.DeliveryStatus
                        }
                    });
                    if (response && response.modifiedCount === 1) {
                        return __res_.out(req, res, {
                            status: "success",
                            statusCode: 200,
                            message: "Successfully updated.",
                        });
                    }
                    else {
                        return __res_.out(req, res, {
                            status: false,
                            statusCode: 500,
                            message: "Internal server error!!!",
                            data: e,
                        });
                    }
                }
                else if (status.DeliveryStatus == 3 && order.DeliveryStatus === 4) {
                    const response = await ordersModel.updateOne({ _id: order.OrderId, AssignedTo: id }, {
                        $set: {
                            DeliveryStatus: order.DeliveryStatus
                        }
                    });
                    if (response && response.modifiedCount === 1) {
                        return __res_.out(req, res, {
                            status: "success",
                            statusCode: 200,
                            message: "Successfully updated.",
                        });
                    }
                    else {
                        return __res_.out(req, res, {
                            status: false,
                            statusCode: 500,
                            message: "Internal server error!!!",
                            data: e,
                        });
                    }
                }
                else if ((status.DeliveryStatus !== 1) && (status.DeliveryStatus >= order.DeliveryStatus)) {
                    const option = (status.DeliveryStatus == 0) ? 1 : (status.DeliveryStatus == 2) ? 3 : 4;
                    return __res_.out(req, res, {
                        status: "error",
                        statusCode: 400,
                        message: `You can only update status code ${option}(Picked up from service provider).`,
                    });
                }
                else {
                    return __res_.out(req, res, {
                        status: "error",
                        statusCode: 200,
                        message: "You dont have permission.",
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