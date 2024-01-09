const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ServiceManSchema = Schema({ 
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true
    },
    Address:  {
        type: String,
        required: false
    }, 
    DateOfBirth: {
        type: String,
        required: false
    },
    Role:{
        type:String,
        require:true
    },
    CurrentLocation: {
        type: String,
        required: false
    },
    ActivityStatus: {
        type: String,
        required: false
    },
    AssignedOrders: [{
        type: String,
        required: false
    }],
    CompletedOrders: [{
        type: String,
        required: false
    }],
    Rating: {
        type: Number,
        required: false
    },
    LastActive: {
        type: Date,
        required: false
    }
},
{
    timestamps: true
});
module.exports = mongoose.model('serviceman',ServiceManSchema);