const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel");
// const { set } = require("mongoose");
const stripe = require("stripe")(
  "sk_test_51NjDbvSDdruy8IaQAsAXqOz1fFobV1HClNfJ325QW6Xnn4X9yfZ9U4dty4OaKA4vFzL3aCDVq9un7SlDqDCntq2Y00LsI9cY2Z"
);

// **********************************************************************************************************

exports.registerUser = async (req, res) => {
  const file = req.file.filename;
  console.log("file", file);
  const { name, phoneNumber, email, passWord, rePassword } = req.body;

  try {
    if (!name || !phoneNumber || !email || !passWord || !file) {
      res
        .status(400)
        .json({ success: false, error: "please fill all fields!" });
    } else {
      if (passWord === rePassword) {
        const RegisteredUser = await userModel({
          name,
          phoneNumber,
          email,
          passWord,
          rePassword,
          avatar: file,
        });
        const finalUserData = await RegisteredUser.save();
        res.status(200).json({ success: true, RegisteredUser: finalUserData });
      } else {
        res
          .status(400)
          .json({ message: "password and re-Password Not matched !" });
      }
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
// **********************************************************************************************************

//userLogin
exports.userLogin = async (req, res) => {
  const { email, passWord } = req.body;

  if (!email || !passWord) {
    res.status(400).json({ success: false, message: "please fill All Fields" });
  }
  try {
    const loginUser = await userModel.findOne({ email: email });
    console.log(loginUser);

    if (loginUser) {
      const verifiedUser = await bcrypt.compare(passWord, loginUser.passWord);
      if (verifiedUser) {
        //token generation
        const token = await loginUser.tokenGeneration();

        //cookie generation
        res.cookie("fullStackCookie", token, {
          expiresIn: "1d",
          httpOnly: false,
        });

        res.status(200).json({ success: true, user: loginUser, token: token });
      } else {
        res.status(400).json({ success: false, message: "invalid details" });
      }
    } else {
      // User not found
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// **********************************************************************************************************

//userLogout
exports.userLogout = async (req, res) => {
  try {
    res.cookie("fullStackCookie", null, {
      expiresIn: new Date(Date.now()),
      httpOnly: false, 
    });
    res.status(200).json({ success: true, message: "cookie token clear" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// **********************************************************************************************************

//Send mail to user for the purpose of passWord reset
exports.sendMailForPassword = async (req, res) => {
  //transporter for sending mail
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  try {
    const { email } = req.body;
    const findUser = await userModel.findOne({ email: email });

    if (findUser) {
      const newToken = jwt.sign({ _id: findUser._id }, process.env.secretKey, {
        expiresIn: "1d",
      });

      const setUserToken = await userModel.findByIdAndUpdate(
        { _id: findUser._id },
        {
          passWordResetToken: newToken,
        },
        {
          new: true,
        }
      );
      res.send(setUserToken);

      if (setUserToken) {
        //maileroption
        const mailerOption = {
          from: "sangwansachin631@gmail.com",
          to: req.body.email,
          subject: "Reset your passWord With in 30 min",
          text: `http://localhost:3000/${findUser._id}/${setUserToken.passWordResetToken}`,
        };

        //send mail to user
        transporter.sendMail(mailerOption, (error, info) => {
          if (error) {
            console.log(error);
            res.send(error);
          } else {
            res.send(info.response);
          }
        });
      } else {
        res.send("token is not generated Yet");
      }
    } else {
      res.send("invalid email ");
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
// **********************************************************************************************************

exports.forgotPassWord = async (req, res) => {
  try {
    const { _id, token } = req.params;
    const verifiedUser = await userModel.findOne({
      _id: _id,
      passWordResetToken: token,
    });
    console.log();

    const verifyToken = jwt.verify(token, process.env.secretKey); 

    if (verifiedUser && verifyToken) {
      res.status(200).json({ success: true, user: verifiedUser });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

// ********************************************************************************************************

// enter new  password api work on click
exports.newPassWord = async (req, res) => {
  //we have to verify the user and token agin here beacuase when user spend more then 2 min after react at newpasssword page then it shown token expire error
  const { passWord } = req.body;
  const { _id, token } = req.params;
  // console.log(passWord,_id,token)

  try {
    const validUser = await userModel.findOne({
      _id: _id,
      passWordResetToken: token,
    });
    const verifiedToken = jwt.verify(token, process.env.secretKey);

    if (validUser && verifiedToken._id) {
      const newHashPassWord = await bcrypt.hash(passWord, 12);
      console.log(newHashPassWord);
      const findUser = await userModel.findByIdAndUpdate(_id, {
        passWord: newHashPassWord,
      });
      console.log("sachin", findUser);
      await findUser.save();
      res.status(200).json({ user: findUser });
    } else {
      res.status(200).json({ user: "userNotfound" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};
// *******************************************************************************************

//get all details of the login user
exports.getLoginUserDetails = async (req, res) => {
  try {
    const user = req.rootUser._id;
    console.log(user);
    const findLoginUserDetails = await userModel.findOne(user);
    res.status(200).json({ user: findLoginUserDetails });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};

// *******************************************************************************************

//change the passWord of the USer after Login
exports.changeUserPassWordAfterLogin = async (req, res) => {
  const user = req.rootUser;
  try {
    const { newPassWord, newRePassword } = req.body;
    if (!newPassWord || !newRePassword) {
      res.send("please Enter All Fields");
    }

    const nextHashPassWord = await bcrypt.hash(newPassWord, 12);
    const nextReHashPassWord = await bcrypt.hash(newRePassword, 12);

    if (nextHashPassWord && nextReHashPassWord) {
      const updatePassword = await userModel.findByIdAndUpdate(
        user._id,
        {
          passWord: nextHashPassWord,
          rePassword: nextReHashPassWord,
        },
        {
          new: true,
        }
      );

      res.status(200).json({ message: updatePassword });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// *****************************************************************************************************

//chnage email,phoneNumber,phoneNumber
exports.updateProfileAfterLogin = async (req, res) => {
  try {
    const file = req.file.filename;
    console.log(file); ////////////////////////////////////////////////////////////////////////////////////
    const { _id } = req.rootUser;
    const { name, email, phoneNumber } = req.body;

    const updateProfile = await userModel.findByIdAndUpdate(
      _id,
      {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        avatar: file,
      },
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: updateProfile, mesage2: "updateed successFuly" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// *********************************************************************************************************

// some admin work api toward Users

// *************************************************************************************************************************
//get all user for admin data manipuldation
exports.allRegisteredUserDetails = async (req, res) => {
  try {
    const user = await userModel.find();
    res.status(201).json({ success: true, user: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
// **************************************************************************************************************************
//get particular user by admin
exports.getParticularUserDataForAdmin = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await userModel.findOne({ _id: _id });

    res.status(201).json({ success: true, user: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
// *************************************************************************************************************************

//update user admin roles
exports.updateRole = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const { name, email, phoneNumber, role } = req.body;
    const updateUserData = await userModel.findByIdAndUpdate(
      _id,
      { name: name, email: email, phoneNumber: phoneNumber, role: role },
      { new: true }
    );
    res.status(201).json({ success: true, user: updateUserData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// *************************************************************************************************************************

//deleteUserFrom admin panel
exports.deleteUserFromAdmin = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const deletedUser = await userModel.deleteOne({ _id: _id });
    res.status(201).json({ success: true, deleteduser: deletedUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
// *************************************************************************************************************************

//addToCart
// exports.addToCart = async (req, res) => {
//   try {
//     const { _id } = req.params;
//     const userID = req.rootUser._id;
//     const findUser = await userModel.findOne({ _id: userID });

//     let foundProduct = false;

//     for (let i = 0; i < findUser.cart.length; i++) {
//       const curelem = findUser.cart[i];
//       if (curelem.product._id.toString() === _id) {
//         console.log('Product found in cart. Incrementing quantity.');
//         curelem.quantity =curelem.quantity+ 1;
//         foundProduct = true;
//         break;
//       }
//     }

//     if (!foundProduct) {
//       console.log('Product not found in cart. Adding new product.');
//     }

//     console.log('Updated cart:', findUser.cart);

//     await findUser.save();
//     console.log('User object saved:', findUser);
//     res.status(200).json({ user: findUser });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

//add to cart
exports.addToCart = async (req, res) => {
  try {
    const { _id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({ message: "Invalid quantity." });
      return;
    }

    // Find product to be stored in the cart
    const findProduct = await productModel.findOne({ _id: _id });

    if (!findProduct) {
      res.status(400).json({ message: "Product not found" });
      return;
    }

    // Find user where data is stored
    const userID = req.rootUser._id;
    const findUser = await userModel.findOne(userID);

    let foundProduct = false;

    for (let i = 0; i < findUser.cart.length; i++) {
      const curelem = findUser.cart[i];
      if (curelem.product._id.toString() === _id) {
        curelem.quantity = quantity;
        foundProduct = true;
        break;
      }
    }

    if (!foundProduct) {
      findUser.cart.push({
        product: findProduct,
        quantity: quantity,
        time: Date.now(),
      });
    }

    await findUser.save();
    res.status(200).json({ user: findUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

// //delete to cart api

// exports.deleteCart = async (req, res) => {
//   try {
//     const { _id } = req.params;
//     //find product which want to store at cart
//     const findProduct = await productModel.findOne({ _id: _id });
//     // console.log(findProduct);
//     if (!findProduct) {
//       res.status(400).json({ message: "product not found" });
//     }
//     //find user where data is store
//     const userID = req.rootUser._id;
//     const findUser = await userModel.findOne(userID);

//     //push the product user cart
//     findUser.cart.pop({
//       product: findProduct,
//       quantity: 0,
//     });
//     res.status(200).json({ user: findUser });
//     await findUser.save();
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

//delete to cart api

exports.deleteCart = async (req, res) => {
  try {
    const { _id } = req.params;
    //find product which want to remove from the cart
    const findProduct = await productModel.findOne({ _id: _id });
    // console.log(findProduct);
    if (!findProduct) {
      return res.status(400).json({ message: "Product not found" });
    }
    //find user where data is stored
    const userID = req.rootUser._id;
    const findUser = await userModel.findOne(userID);

    // Remove the product from user's cart
    findUser.cart = findUser.cart.filter((item) => {
      // Remove the item with the matching product _id
      return item.product._id.toString() !== findProduct._id.toString();
    });

    // Save the updated user data
    await findUser.save();

    res.status(200).json({ user: findUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//getPrducts from user cart by getting login user details
exports.getCartData = async (req, res) => {
  try {
    const cartData = await userModel.findOne({ _id: req.userId });
    res.status(200).json({ success: true, cartData: cartData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//payNow //checkout

exports.payNow = async (req, res) => {
  const { products1 } = req.body;

  const lineItems = products1.map((curelem) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: curelem.product.name,
        images: [curelem.product?.images[0].url],
      },
      unit_amount:curelem.product.sellingPrice * 100, //*curele.quantity
    },
    quantity:curelem.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/sucess",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
};
