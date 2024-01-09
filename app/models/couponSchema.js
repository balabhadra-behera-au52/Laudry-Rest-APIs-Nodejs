const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    Code: {
        type: String,
        required: true,
        unique: true,
    },
    Amount: {
        type: Number,
        required: true,
    },
    ExpirationDate: {
        type: Date,
        required: true,
    },
    IsActive: {
        type: Boolean,
        default: true,
    }
}
);

module.exports = mongoose.model('coupon', CouponSchema);