const mongoose = require("mongoose");

const YearlyRevenueSchema = new mongoose.Schema(
  {
    line_of_business: String,
    revenue_type: String,
    product: String,
    year: Number,
    month: String,
    acv: Number,
    tcv: Number,
    revenue: Number,
  },
  { timestamps: true }
);

const YearlyRevenue = mongoose.model("YearlyRevenue", YearlyRevenueSchema);

module.exports = {
  YearlyRevenue,
};
