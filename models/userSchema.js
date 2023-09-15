const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "User must have email Id"],
      trim: true,
      unique: true,
      validate: {
        validator: function (e) {
          const exp = /[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
          return e.match(exp);
        },
        message: "Invalid Email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

const user = mongoose.model("users", userSchema);
module.exports = {
  user,
};
