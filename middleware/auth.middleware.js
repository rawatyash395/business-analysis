const jwt = require("jsonwebtoken");
const { user } = require("../models/userSchema");

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  try {
    if (!bearerHeader) {
      return res.status(403).send("You are logged out.Plesae,loggin again.");
    }

    if (typeof bearerHeader === "undefined") {
      return res.status(401).send("Invalid Token");
    }

    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    const encodedToken = req.headers.authorization.split(" ")[1];

    const decode = jwt.decode(
      encodedToken,
      process.env.JWT_TOKEN || "jwt_token"
    );
    if (!decode) {
      return res.status(401).send("unauthorize");
    }

    const record = await user.find({ _id: decode.id });
    if (!record) {
      return res.status(403).send("User does not exist.");
    }

    jwt.verify(
      encodedToken,
      process.env.JWT_TOKEN || "jwt_token",
      function (err) {
        if (err) {
          res.status(400).send("Please,Login again");
          next("Please,Login again");
        }
        req.token = token;
        next();
      }
    );
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = {
  verifyToken,
};
