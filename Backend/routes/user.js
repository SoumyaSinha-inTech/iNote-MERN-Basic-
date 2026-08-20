const express = require("express");
const router = express.Router();
const userModel = require("../models/User");

//password and cookie
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//middleware-ifLoggedIn
const ifLoggedIn = require("../middleware/ifLoggedIn");

//require validator
const { body, validationResult, cookie } = require("express-validator");

//USER ROUTES:
//Creating user
router.post(
  "/createuser",
  //Middleware: data validation
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //error handle of validation
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    //error handling(try-catch):
    try {
      let { name, email, password } = req.body;
      //check if user exists:
      let checkUser = await userModel.findOne({ email });
      if (checkUser) {
        return res.status(400).json({ error: "User already exists" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, async (err, hash) => {
            //creating user
            let createdUser = await userModel.create({
              name,
              email,
              password: hash,
            });

            //cookie
            let token = jwt.sign(
              { email, _id: createdUser._id },
              process.env.JWT_SECRET,
            );
            res
              .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
              })
              .json({
                success: true,
              });
            res.send(createdUser);
          });
        });
      }
    } catch (err) {
      console.error(error.message);
      res.send(500).send("Some error occured");
    }
  },
);

//Logging In user
router.post(
  "/login",
  //Middleware: data validation
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    //error handle
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    let { email, password } = req.body;

    try {
      let checkuser = await userModel.findOne({ email });
      if (!checkuser) {
        return res.status(400).json({ error: "Incorrect Credentials" });
      } else {
        let pass = await bcrypt.compare(password, checkuser.password);
        if (!pass) {
          return res.status(400).json({ error: "Incorrect Credentials" });
        } else {
          //cookie
          let token = jwt.sign(
            { email, _id: checkuser._id },
            process.env.JWT_SECRET,
          );
          res
            .cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
            })
            .json({
              success: true,
            });
          res.send(token);
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  },
);

//Get loggedin user details
router.post("/getuser", ifLoggedIn, async (req, res) => {
  const _id = req.user._id;
  let foundUser = await userModel.findById(_id).select("-password");
  res.send(foundUser);
});

//LogOut User
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

module.exports = router;
