const serviceManModel = require('../models/serviceMan')
const __res_ = require('../utils/helpers/send-response');
const config = require('../utils/config/index')
const asyncHandler = require('../middlewares/asyncHandler')
const keys = require('../utils/config/index');
const bcrypt = require('bcryptjs')
const activity = require('../utils/activities/activity.controller');
const ordersModel = require('../models/orderSchema');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    createLaundryMan: async function (req, res) {
        try {
            const password = req.body.Password;
            const newPassword = bcrypt.hashSync(password, keys.saltRounds);
            serviceManModel.findOne({ Email: req.body.Email, Role:"LaundryMan" }).then((laundryManInfo) => {
                if (laundryManInfo) {
                    return __res_.out(req, res, {
                        status: "found",
                        statusCode: 200,
                        message: "This User Already Exit!!.",
                    })
                } else {
                    const laundryManData = {
                        FirstName: req.body.FirstName,
                        LastName: req.body.LastName,
                        Email: req.body.Email,
                        Password: newPassword,
                        Phone: req.body.Phone,
                        Address: req.body.Address,
                        Role:"LaundryMan",
                        DateOfBirth: req.body.DateOfBirth,
                        CurrentLocation: req.body.CurrentLocation,
                        ActivityStatus: req.body.ActivityStatus,
                        AssignedOrders: req.body.AssignedOrders,
                        CompletedOrders: req.body.CompletedOrders,
                        Rating: 0,
                        LastActive: new Date()
                    };

                    new serviceManModel(laundryManData).save().then((data) => {
                        if (data) {
                            const payload = {
                                _id: data._id,
                                Email: data.Email,
                                FirstName: data.FirstName,
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

    // Will authenticate the laundryMan with email and password
    laundryManLogin: function (req, res, next) {
        serviceManModel.findOne({Role:"LaundryMan",
            Email: req.body.Email
        }).then((laundryManInfo) => {
            if (!laundryManInfo) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 404,
                    message: "Laundry Man Does Not Exit!!",
                })
            } else if (req.body.Email === laundryManInfo.Email && (bcrypt.compareSync(req.body.Password, laundryManInfo.Password))) {
                const payload = {
                    _id: laundryManInfo._id,
                    Email: laundryManInfo.Email,
                    FirstName: laundryManInfo.FirstName,
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
    findLaundryManById: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const id = new ObjectId(req.params.id);

                const laundryMan = await serviceManModel.findOne({Role:"LaundryMan", _id: id },{Password:0})
                if (laundryMan) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Successfully!!",
                        data: laundryMan,
                    });
                }
                else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "Laundry Man Not found.!!",
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
    getAllLaundryMans: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;
            const totalCount = await serviceManModel.find({Role:"LaundryMan"}).countDocuments();  // Get the total count of documents in the collection
            const laundryMans = await serviceManModel.find({Role:"LaundryMan"},{Password:0}).skip(skipCount)
                .limit(pageSize);
            if (laundryMans) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Successfully!!",
                    data: {
                        totalRecords: totalCount,
                        currentPage: page,
                        pageSize: pageSize,
                        records: laundryMans,
                    }
                });
            }
            else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 404,
                    message: "No Laundry Mans found.!!",
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
    updateLaundryManById: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const id = new ObjectId(req.params.id);
                const { Phone, Password, ...updateFields } = req.body;

                const laundryMan = await serviceManModel.updateOne({ _id: id, Role:"LaundryMan" }, {
                    $set: updateFields
                })
                if (laundryMan.modifiedCount > 0) {
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
                        message: "Laundry Man Not found.!!",
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
    updateOrderStatus: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id) && ObjectId.isValid(req.body.OrderId)) {
                const id = new ObjectId(req.params.id);
                const order = req.body;
                const status = await ordersModel.findOne({ _id: order.OrderId, AssignedTo: id });
                if(!status){
                    return __res_.out(req, res, {
                        status: "error",
                        statusCode: 404,
                        message: "No order found.",
                    });
                }else if (status.DeliveryStatus == 1 && order.DeliveryStatus === 2) {
                    const response = await ordersModel.updateOne({ _id: order.OrderId, AssignedTo: id }, {
                        $set: {
                            DeliveryStatus: req.body.DeliveryStatus
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
                            status: "error",
                            statusCode: 400,
                            message: "Invalid details.",
                        });
                    }
                }
                 else if (status.DeliveryStatus == 1 ){
                    return __res_.out(req, res, {
                        status: "error",
                        statusCode: 400,
                        message: "You can only update status code 2(Picked up from service provider).",
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