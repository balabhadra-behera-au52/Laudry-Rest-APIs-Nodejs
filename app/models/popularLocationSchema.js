const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = Schema({ 
    PostalCode: {
        type: Number,
        required: true
    },
    LocationName: {
        type: String,
        required: true
    },
    CityName: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        required: true
    },
    ServiceAvailable: {
        type: Boolean,
        required: true
    },
    DeliveryTimeEstimates: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
});
module.exports = mongoose.model('location', LocationSchema);