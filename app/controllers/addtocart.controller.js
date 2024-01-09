const { response } = require("express");
const cartModel = require("../models/cartSchema");
const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;





module.exports = {
    createaddtocart: async function (req, res) {
        try {
            const userId = req.params.id;
            const productId = req.body.productId;
            if(!userId || !productId){
                  return res.status(400).json({message:"userId and productId are require"});
            }
            
            const data = await cartModel.findOne({userId , productId})
            if(data){
               return res.status(200).json({message:"userid and productid already exits"});
            }
                const newCart = new cartModel({userId , productId});
        
                await newCart.save();

            return res.status(201).json({message:"add to cart succesfully"});

        } catch (error) {
            console.log(error)
           return res.status(500).json({message:"internal sever error!!"})
            
        }
    }
}