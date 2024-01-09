const walletModel = require('../models/walletSchema');
const __res_ = require('../utils/helpers/send-response');
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;
const couponModel = require('../models/couponSchema');

module.exports = {
    addMoneyToWalletByUserId: async (req, res) => {
        try {
            const { Coupon } = req.body;
            if (ObjectId.isValid(req.params.id)) {
                const userId = new ObjectId(req.params.id);

                const coupon = await couponModel.findOne({ Code: Coupon })
                if (!coupon) {
                    return __res_.out(req, res, {
                        status: "error",
                        statusCode: 400,
                        message: `Please enter valid coupon`,
                    })
                }
                const userInfo = await walletModel.findOne({ UserId: userId })
                if (userInfo && userInfo.UserId.equals(userId)) {
                    userInfo.set({ Amount: (userInfo.Amount + parseInt(coupon.Amount)) })
                    await userInfo.save()
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: `${coupon.Amount} Added to your Wallet!!. Updated Amount ${userInfo.Amount}`,
                    })
                }
                else {
                    // Create a new wallet document
                    const newWallet = new walletModel({
                        UserId: userId,
                        Amount: coupon.Amount,
                        Type: Type,
                        Status: Status,
                    });

                    // Save the new wallet document
                    await newWallet.save();

                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Wallet Created Successfully!!.",
                    })
                }
            }
            else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid id.",
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
    createCoupon: async (req, res) => {
        try {
            const {
                ExpirationDate, ...body } = req.body;

            const isNumber = /^\d+$/;
            if (!isNumber.test(body.Amount)) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: `Please enter valid amount. (${body.Amount})`,
                })
            }
            const newCoupon = new couponModel({
                ...body,
                ExpirationDate: new Date(ExpirationDate),
            });

            await newCoupon.save()
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: "Coupon Created Successfully!!.",
            })

        } catch (error) {
            console.log(error)
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: error
            });
        }
    }
}
