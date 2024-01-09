const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = Schema({ 
    TransactionId: {
        type: String,
        required: true
    },
    OrderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    BankTransactionId: {
        type: String,
        required: true
    },
    Amount: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    ResponseCode: {
        type: String,
        required: true
    },
    ResponseMessage: {
        type: String,
        required: true
    },
    TransactionDate: {
        type: Date,
        required: true
    },

},
{
    timestamps: true
});
module.exports = mongoose.model('transaction', TransactionSchema);