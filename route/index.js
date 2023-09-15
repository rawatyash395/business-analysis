const express = require("express");
const app = express.Router();
const userController = require("../controller/users");
const revenueController = require("../controller/revenue");
const middleware = require("../middleware/auth.middleware");

app.post("/login", userController.login);

app.post("/register", userController.registerUser);

app.post("/addRevenue", middleware.verifyToken, revenueController.addRevenue);
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

module.exports = app;
