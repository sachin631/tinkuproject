const mongoose = require("mongoose");

const ProductSchema =new  mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true
  },
  orignialPrice: {
    type: Number,
    required: true,
    maxLength: 8
  },
  sellingPrice: {
    type: Number,
    required: true,
    maxLength: 8
  },
  category:{
    type:String,
    required:true
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  stock: {
    type: Number,
    required: true,
    maxLength: 4, 
    default: 1,
  },
  numofReview: {
    type: Number,
    default: 0,
  },
  review: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      Comment: {
        type: String,
        required: true,
      },
    },
  ],
  // user:{
  //     type:mongoose.Schema.ObjectId,
  //     required:true
      
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productModel = new mongoose.model("products", ProductSchema);
module.exports = productModel;
