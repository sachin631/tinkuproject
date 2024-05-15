const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

//store all the orders
exports.createUserOrder = async (req, res) => {
  try {
    const {
      shippingInformation,
      orderItems,
      registerUserModel, //user
      paymentInfo,
      paidAt,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderStatus,
      deliveredAt,
      createdAt,
    } = req.body;
    const storeOrder = await orderModel.create({
      shippingInformation,
      orderItems,
      registerUserModel, //user
      paymentInfo,
      paidAt,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderStatus,
      deliveredAt,
      createdAt,
    });

    res.status(201).json({ success: true, storeOrder: storeOrder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//get the single order //by id of order

//some thing missing populate method is not working or email and name of user not found
exports.getSingleorder = async (req, res) => {
  const { _id } = req.params;
  try {
    const singleOrder = await orderModel
      .findById(_id)
      .populate("registerusers", "name email"); //populate user of orderSection so we can access user name and emial data
    console.log(singleOrder);
    res.status(200).json({ success: true, singleOrder: singleOrder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  } 
};

//getorder for loged In User //myOrder
exports.myOrder = async (req, res) => {
  try {
    const userOrder = await orderModel.find({ user: req.userId });
    console.log(userOrder);

    res.status(200).json({ success: true, userOrderr: userOrder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//get all order for --admin
exports.allOrder = async (req, res) => {
  try {
    const findAllOrderIs = await orderModel.find();
    let totalAmount = 0;
    findAllOrderIs.forEach((findAllOrderIs) => {
      totalAmount = findAllOrderIs.totalPrice + totalAmount;
    });
    res.status(200).json({
      success: true,
      findAllOrderIs: findAllOrderIs,
      totalAmount: totalAmount,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//update the order status //from orderId
exports.orderStatus = async (req, res) => {
  try {
    const { _id } = req.params;

    const order = await orderModel.findById(_id);

    if (order.orderStatus == "Delivered") {
      res.send("order is already marked as Delivered No updation is allowed");
    }

    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status;

    if (order.orderStatus == "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

async function updateStock(id, quantity) {
  const product = await productModel.findById(id);
  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

//delete the order
exports.deleteOrder = async (req, res) => {
  try {
    const { _id } = req.params;
    const order = await orderModel.findByIdAndDelete(_id);
    if (!order) {
      throw new Error({ error: " order not found" });
    }

    res.status(200).json({ success: true, order: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
