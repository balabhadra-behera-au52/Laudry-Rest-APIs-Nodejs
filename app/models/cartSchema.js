const mongoose = require("mongoose");
const Schema = mongoose.Schema
const cartSchema = Schema({
        userId:{
            type:Schema.Types.ObjectId,
            rerquire:true
        },
        productId:{
            type:Schema.Types.ObjectId,
            require:true
        },
    },
       
       { 
         timestamps: true,
});
module.exports = mongoose.model('cart',cartSchema);