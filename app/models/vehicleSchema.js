const mongoose =require('mongoose')
const Schema = mongoose.Schema;

const VehicleSchema =Schema({
    RunnerId:{
        type:Schema.Types.ObjectId,
        require:true
    },
    VehicleType: {
        type: String,
        required: false
    },
    VehicleNumber: {
        type: String,
        required: false
    },
},{
    timestamps: true
})
module.exports = mongoose.model('vehicle',VehicleSchema);