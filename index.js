const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const route = require("./route/index");
const port = 3000;
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api", route);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose.connect(
  "mongodb+srv://rawatyash395:3wGlr22cYGNq23zT@business-analysis.ouur9mr.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
