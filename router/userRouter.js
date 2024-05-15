const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController");
const userAuthenticationMiddleware = require("../middleWare/userAuthenticationMiddleware");
// const upload = require('../multerConfig/multer');
const upload = require("../multerConfig/multer");

//register user
userRouter.post(
  "/registerUser",
  upload.single("avatar"),
  userController.registerUser
);
//userLogin
userRouter.post("/userLogin", userController.userLogin);
//userLogout
userRouter.get("/userLogout", userController.userLogout);
//Send mail to user for the purpose of passWord reSet
userRouter.post("/sendMailForPassword", userController.sendMailForPassword);
//forgot passWord //verify after click on above sent link
userRouter.get("/forgotPassWord/:_id/:token", userController.forgotPassWord);
//updatepassword when reach on above page
userRouter.post("/newPassWord/:_id/:token", userController.newPassWord);

//acces some data after userLogin

//getUserDetails After Login
userRouter.get(
  "/getLoginUserDetails",
  userAuthenticationMiddleware.userAuthentication,
  userController.getLoginUserDetails
);
userRouter.put(
  "/changeUserPassWordAfterLogin/",
  userAuthenticationMiddleware.userAuthentication,
  userController.changeUserPassWordAfterLogin
);
userRouter.put(
  "/updateProfileAfterLogin",
  upload.single("avatar"),
  userAuthenticationMiddleware.userAuthentication,
  userController.updateProfileAfterLogin
);

// admin work

//if admin want to get all details of user
userRouter.get(
  "/admin/allregistereduserdetails",
  userAuthenticationMiddleware.userAuthentication,
  userAuthenticationMiddleware.authorizeRole("admin"),
  userController.allRegisteredUserDetails
);
//get single user data for admin
userRouter.get(
  "/admin/getparticularuserdata/:_id",
  userAuthenticationMiddleware.userAuthentication,
  userAuthenticationMiddleware.authorizeRole("admin"),
  userController.getParticularUserDataForAdmin
);
//update Role for admin
userRouter.put(
  "/admin/updateRole/:_id",
  userAuthenticationMiddleware.userAuthentication,
  userAuthenticationMiddleware.authorizeRole("admin"),
  userController.updateRole
);
//delete user from admin
userRouter.delete(
  "/admin/deleteuserfromadmin/:_id",
  userAuthenticationMiddleware.userAuthentication,
  userAuthenticationMiddleware.authorizeRole("admin"),
  userController.deleteUserFromAdmin
);

// cart

//addToCart
userRouter.post(
  "/addToCart/:_id",
  userAuthenticationMiddleware.userAuthentication,
  userController.addToCart
);
//delete Product from Cart
userRouter.delete(
  "/deleteToCart/:_id",
  userAuthenticationMiddleware.userAuthentication,
  userController.deleteCart
);
//getcartdata for purpose add and remove cart
userRouter.get(
  "/getcartdata",
  userAuthenticationMiddleware.userAuthentication,
  userController.getCartData
);

//checkOut api
userRouter.post("/payNow",userController.payNow);


module.exports = userRouter;
