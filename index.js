const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cors = require("cors");
const route = require("./route/index");
const port = 3000;

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api", route);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

mongoose.connect(process.env.DATABASE_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
