const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WalletSchema = Schema({ 
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    Amount: {
        type: Number,
        required: true
    },
    Type: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
},
{
    timestamps: true
});
module.exports = mongoose.model('wallet', WalletSchema);