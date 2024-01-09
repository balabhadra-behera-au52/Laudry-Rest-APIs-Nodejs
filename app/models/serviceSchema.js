const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ServiceSchema = Schema({ 
    
    Category: {
        type: String,
        required: true
    },
    SubCategories: [
       { 
        Name: {
            type: String,
            required: false
        },
        Price: {
            type: Number,
            required: false
        },
        Image: {
            type: String,
            required: false
        },
        Currency: {
            type: String,
            required: false
        },
    }
    ],
    City: {
        type: String,
        required: false
    },
    Status: {
        type: String,
        required: false
    },
},
{
    timestamps: true
});
module.exports = mongoose.model('service', ServiceSchema);