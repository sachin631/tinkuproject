const express = require("express");
const productRouter = express.Router();
const ProductController = require("../controller/productController");
// const userAuthenticationMiddleware = require("../middleWare/userAuthenticationMiddleware");
const userAuthenticationMiddleware = require("../middleWare/userAuthenticationMiddleware");

//store the product --admin
productRouter.post(
  "/postProduct",
  userAuthenticationMiddleware.userAuthentication,
  userAuthenticationMiddleware.authorizeRole("admin"),
  ProductController.postProduct
);

//getAllProduct   --user
productRouter.get("/getAllProduct", ProductController.getAllProduct);

//getSingleProduct  --user
productRouter.get("/getSingleProduct/:_id", ProductController.getSingleProduct);

//updateProduct  --Admin
productRouter.put(
  "/updateProduct/:_id",
  userAuthenticationMiddleware.userAuthentication,
  userAuthenticationMiddleware.authorizeRole("admin"),
  ProductController.updateProduct
);

//deleteTheProduct  --Admin
productRouter.delete(
  "/deleteProduct/:_id",
  userAuthenticationMiddleware.userAuthentication,
  userAuthenticationMiddleware.authorizeRole("admin"),
  ProductController.deleteProduct
);

module.exports = productRouter;
