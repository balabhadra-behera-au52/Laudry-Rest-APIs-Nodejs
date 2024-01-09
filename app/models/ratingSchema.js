const mongoose = require('mongoose');
Schema = mongoose.Schema;

const RatingSchema = Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    Rating: {
        type: Number,
        require: true,
        default:0
    },
    RunnerRating: {
        type: Number,
        require: true,
        default:0
    },
    OrderId: {
        type: Schema.Types.ObjectId,
        require: true,
    },
}, {
    timestamps: true
});
module.exports = mongoose.model('rating', RatingSchema)