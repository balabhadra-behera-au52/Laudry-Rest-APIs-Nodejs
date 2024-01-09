const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    Addresses: [
        {
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
    ]
},
    {
        timestamps: true
    });
module.exports = mongoose.model('useraddress', UserSchema);