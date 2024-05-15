const productModel = require("../models/productModel");
const apiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: "dbv9xrol8",
  api_key: "936789934247448",
  api_secret: "mRfY_QLcfn_dUZiJ6Emz4VZCklU",
});

// store the product --admin
// exports.postProduct = async (req, res) => {

//   let images=[];

//   if (typeof req.body.images === "string") {
//     images.push(req.body.images);
//   } else {
//     images = req.body.images;
//   }

//   const imagesLinks = [];

//   for (let i = 0; i < images.length; i++) {
//     const result = await cloudinary.v2.uploader.upload(images[i], {
//       folder: "e-commerce",
//     });

//     imagesLinks.push({
//       public_id: result.public_id,
//       url: result.secure_url,
//     });
//   }

//   req.body.images = imagesLinks;
//   req.body.user = req.user.id;

//   const {
//     name,
//     description,
//     orignialPrice,
//     sellingPrice,

//     category,
//     // images,
//     stock,
//     numofReview,
//     review,
//     // user,
//     createdAt,
//   } = req.body;

//   // images:photo

//   try {
//     const productData = new productModel({
//       name,
//       description,
//       orignialPrice,
//       sellingPrice,

//       category,

//       images,
//       stock,
//       numofReview,
//       review,
//       // user,
//       createdAt,
//     });
//     await productData.save();
//     res.status(200).json({ message: productData });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.postProduct = async (req, res) => {
  try {
   

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "ecommerce",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
    // req.body.user = req.user.id;

    const product = await productModel.create(req.body);

    res.status(201).json({
      success: true,
      product:product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//getAllProduct  --user
exports.getAllProduct = async (req, res) => {
  try {
    const resultPerPage = 5;
    const productCount = await productModel.countDocuments();
    const features = new apiFeatures(productModel.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const data = await features.query;
    if (data) {
      res.status(201).json({ message: data, productCount });
    } else {
      res.send("data not found");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

//getSingleProduct

exports.getSingleProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const getSingleProduct = await productModel.findById({ _id });
    console.log(getSingleProduct);
    if (getSingleProduct) {
      res.status(201).json({ message: getSingleProduct });
    } else {
      res.send("data not found");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

//update the product --admin
exports.updateProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const updatingProduct = await productModel.findByIdAndUpdate(
      _id,
      req.body,
      { new: true }
    );
    if (updatingProduct) {
      res.status(201).json({ success: true, message: updatingProduct });
      console.log(updatingProduct);
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//deleteProduct --admin
exports.deleteProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = await productModel.deleteOne({ _id });
    if (data) {
      res.status(201).json({ success: true, message: data });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
