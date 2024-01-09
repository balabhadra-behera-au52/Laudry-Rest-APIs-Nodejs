const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        require: true
    },
    OrderId:{
        type:Number,
        required:true
    },
    Address: {
        ContactName: {
            type: String,
            require: true,
        },
        ContactNumber: {
            type: Number,
            require: true,
        },
        MakeDefault: {
            type: Boolean,
            require: false,
            default: false
        },
        OpenOnSunday: {
            type: Boolean,
            require: false,
            default: false
        },
        OpenOnSaturday: {
            type: Boolean,
            require: false,
            default: false
        },
        Type: {
            type: String,
            required: false
        },
        Apartment: {
            type: String,
            required: false
        },
        FlatNo: {
            type: String,
            required: false
        },
        Street: {
            type: String,
            required: false
        },
        City: {
            type: String,
            required: false
        },
        State: {
            type: String,
            required: false
        },
        PostalCode: {
            type: String,
            required: false
        },
        PickUpDetail: {
            Time: {
                type: String,
                required: false
            },
            Date: {
                type: String,
                required: false
            }
        }
    },
    OrderItems: [{
        type: Schema.Types.ObjectId,
        ref: 'service',
        required: false
    }],
    OrderTotalCost: {
        type: Number,
        required: false
    },
    OrderStatus: {
        type: String,
        required: false,
        default: 0
    },
    ExpectedDeliveryTime: {
        type: Date,
        required: false
    },
    AssignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'serviceman',
        required: false
    },
    DeliveryStatus: {
        type: Number,
        required: true
    },
    PaymentStatus: {
        type: String,
        required: true
    },
    PaymentMethod: {
        type: String,
        required: true
    },
    AdditionalNotes: {
        type: String,
        default: ""
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model('order', OrderSchema);