const jwt = require("jsonwebtoken");
const { user } = require("../models/userSchema");

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  try {
    if (bearerHeader !== "") {
      if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        const decodedToken = req.headers.authorization.split(" ")[1];

        const decode = jwt.decode(
          decodedToken,
          process.env.JWT_TOKEN || "jwt_token"
        );
        if (decode === null) {
          return res.status(401).send("Please,Login again");
        } else {
          const record = await user.find({ _id: decode.id });
          if (record === null) {
            return res.status(403).send("User does not exist.");
          } else {
            jwt.verify(
              decodedToken,
              process.env.JWT_TOKEN || "jwt_token",
              function (err) {
                if (err) {
                  res.status(400).send("Please,Login again");
                  next("Please,Login again");
                }
                next();
              }
            );
          }
        }
      } else {
        return res.status(401).send("Invalid Token");
      }
    } else {
      return res.status(403).send("You are logged out.Plesae,loggin again.");
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = {
  verifyToken,
};
