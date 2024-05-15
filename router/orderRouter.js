const express=require("express")
const orderRouter=express.Router();
const orderController=require("../controller/orderController.js");
const middleWare=require("../middleWare/userAuthenticationMiddleware");



//create User Order
orderRouter.post("/createuserorder",middleWare.userAuthentication,orderController.createUserOrder);
//getSingleOrder //something missing not behave expected
orderRouter.get("/getsingleorder/:_id",middleWare.userAuthentication,orderController.getSingleorder);
//getorder for loged In User
orderRouter.get("/myorder",middleWare.userAuthentication,orderController.myOrder);
//get all order for --admin with total amout of order placed
orderRouter.get("/allorder",middleWare.userAuthentication,middleWare.authorizeRole("admin"),orderController.allOrder);
//update order Status --admin
orderRouter.put("/orderstatus/:_id",middleWare.userAuthentication,middleWare.authorizeRole("admin"),orderController.orderStatus);
//delete Order
orderRouter.delete("/deleteparticularorder/:_id",middleWare.userAuthentication,middleWare.authorizeRole("admin"),orderController.deleteOrder);




module.exports=orderRouter;
