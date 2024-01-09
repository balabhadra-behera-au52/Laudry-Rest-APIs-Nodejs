const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = Schema({
    Phone:{
        type:Number,
        require:true
    },
    Otp:{
        type:Number,
        require:true
    }
},
{
    timestamps: true
});
module.exports = mongoose.model('OTP', otpSchema);