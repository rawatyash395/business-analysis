const express = require("express");
const app = express.Router();

const userController = require("../controller/users");
const revenueController = require("../controller/revenue");

const middleware = require("../middleware/auth.middleware");

app.get("/getRevenue", middleware.verifyToken, revenueController.getRevenue);
app.get(
  "/searchRevenue",
  middleware.verifyToken,
  revenueController.searchRevenue
);
app.get(
  "/pivot-chart",
  middleware.verifyToken,
  revenueController.getPivotChartData
);

app.post("/login", userController.login);
app.post("/register", userController.registerUser);
app.post("/addRevenue", middleware.verifyToken, revenueController.addRevenue);

module.exports = app;
