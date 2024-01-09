const userModel = require('../models/userSchema');
const ordersModel = require('../models/orderSchema');
const __res_ = require('../utils/helpers/send-response');
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    newOrder: async (req, res) => {
        try {
            if (ObjectId.isValid(req.body.AssignedTo)) {

                const createOrderId = async () => {
                    function generateUniqueNumber() {
                        const min = 100000;
                        const max = 999999;
                        const random = Math.floor(Math.random() * (max - min) + min);
                        return random;
                    }
                    let uniqueOrderId = generateUniqueNumber();
                    const existingOrderId = await ordersModel.findOne({ orderId: uniqueOrderId });
                    if (existingOrderId) {
                        return createOrderId();
                    } else {
                        return uniqueOrderId;
                    }
                };
                createOrderId().then(async (orderId) => {
                    const newOrder = new ordersModel({
                        UserId: req.params.id,
                        OrderId: orderId,
                        Address: req.body.Address,
                        OrderItems: req.body.OrderItems, // Assuming this is an array of Service IDs
                        OrderTotalCost: req.body.OrderTotalCost,
                        OrderStatus: req.body.OrderStatus,
                        ExpectedDeliveryTime: req.body.ExpectedDeliveryTime,
                        AssignedTo: req.body.AssignedTo, // Assuming this is a Runner ID
                        DeliveryStatus: req.body.DeliveryStatus,
                        PaymentStatus: req.body.PaymentStatus,
                        PaymentMethod: req.body.PaymentMethod,
                        AdditionalNotes: req.body.AdditionalNotes,
                    });
                    const savedOrder = await newOrder.save();

                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Order Placed Successfully!!.",
                    })
                })

            }
            else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 500,
                    message: "Something went wrong",
                    data: err
                });
            }

        } catch (error) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: error
            });
        }
    },
    findOrderByOrderId: async (req, res) => {
        try {
            if (req.params.id) {
                const id = req.params.id;
                const orderInfo = await ordersModel.aggregate([
                    {
                        $match: { OrderId: parseInt(id) }
                    },
                    {
                        $group: {
                            _id: null,
                            order: { $push: "$$ROOT" }
                        }
                    },
                    {
                        $lookup: {
                            from: "ratings",
                            localField: "order._id",
                            foreignField: "OrderId",
                            as: "rating"
                        }
                    },
                    {
                        $project: {
                            "_id": 0,
                            "rating._id": 0,
                            "rating.__v": 0,
                            "rating.UserId": 0,
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            order: { $first: { $first: "$order" } },
                            rating: { $first: { $first: "$rating" } }
                        }
                    },
                    { $project: { "_id": 0, } }
                ]);
                if (orderInfo.length > 0) {
                    return __res_.out(req, res, {
                        status: "found",
                        statusCode: 200,
                        message: "Successfully!!.",
                        data: orderInfo[0]
                    });
                } else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "No Order found.!!."
                    });
                }
            }

            else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "wrong OrderId",
                });
            }

        } catch (error) {
            console.log(error)

            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: error
            });
        }
    },
    findOrdersByUserId: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {

                const userId = new ObjectId(req.params.id);
                const page = parseInt(req.query.page) || 1;
                const pageSize = 20;
                const skipCount = (page - 1) * pageSize;
                const totalCount = await ordersModel.countDocuments({ UserId: userId });
                const user = await userModel.findOne({ _id: userId });

                const ordersInfo = await ordersModel.find({ UserId: userId }).skip(skipCount).limit(pageSize);

                if (ordersInfo) {
                    return __res_.out(req, res, {
                        status: "found",
                        statusCode: 200,
                        message: "Successfully!!.",
                        data: {
                            totalRecord: totalCount,
                            currentPage: page,
                            pageSize: pageSize,
                            records: { user, ordersInfo }
                        }
                    })
                }
                else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "No Order found.!!.",
                    })
                }

            }
            else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 500,
                    message: "Something went wrong",
                    data: err
                });
            }

        } catch (error) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: error
            });
        }
    },
    UpdateByOrderId: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const userId = new ObjectId(req.params.id);
                const orderUpdate = await ordersModel.updateOne({ _id: userId },
                    { $set: req.body })
                if (orderUpdate.modifiedCount === 1) {
                    return __res_.out(req, res, {
                        status: "found",
                        statusCode: 200,
                        message: "Updated Successfully!!.",
                    })
                }
                else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "Nothing to update.!!.",
                    })
                }
            }
            else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 500,
                    message: "Something went wrong",
                    data: err
                });
            }

        } catch (error) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: error
            });
        }
    },
}