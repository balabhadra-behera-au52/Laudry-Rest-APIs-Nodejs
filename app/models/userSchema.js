const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = Schema({ 
    FirstName: {
        type: String,
        required: false
    },
    LastName: {
        type: String,
        required: false
    },
    Email: {
        type: String,
        required: false
    },
    Phone: {
        type: Number,
        required: true
    },
    DateOfBirth: {
        type: String,
        required: false
    },
    lastLogin: {
        type: Date,
        required: false
    }, 
},
{
    timestamps: true
});
module.exports = mongoose.model('user', UserSchema);