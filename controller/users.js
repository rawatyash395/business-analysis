const bcrypt = require("bcryptjs");
const { user } = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const email = req.body.email;

    const userData = await user.findOne({ email });
    if (userData) {
      const isMatched = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (isMatched) {
        const id = userData._id;
        jwt.sign(
          { id },
          process.env.JWT_TOKEN || "jwt_token",
          { expiresIn: "30d" },
          async (err, token) => {
            if (err) {
              res.json({
                error: err.message,
              });
            } else {
              const email = userData.email;
              res.status(200).json({
                token,
                email,
              });
            }
          }
        );
      } else {
        return res.status(400).send("Your Password may be wrong");
      }
    } else {
      return res.status(401).send("User doesn't exist!");
    }
  } catch (e) {
    return res.status(401).send(e.message);
  }
};

const registerUser = async (req, res) => {
  try {
    const password = await bcrypt.hash(
      req.body.password,
      +process.env.SALT || 9
    );
    const newUser = new user({
      email: req.body.email,
      password,
    });
    await newUser.save();
    res.status(201).json("User registered successfully.");
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = {
  login,
  registerUser,
};
