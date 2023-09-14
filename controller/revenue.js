const { YearlyRevenue } = require("../models/yearlyRevenueSchema");

const addRevenue = async (req, res) => {
  try {
    const newYearlyRevenue = new YearlyRevenue({
      line_of_business: req.body.line_of_business,
      revenue_type: req.body.revenue_type,
      product: req.body.product,
      year: req.body.year,
      month: req.body.month,
      acv: req.body.acv,
      tcv: req.body.tcv,
      revenue: req.body.revenue,
    });
    await newYearlyRevenue.save();
    res.status(201).json({
      message: "Yearly revenue added successfully.",
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const getRevenue = async (req, res) => {
  try {
    const page = Math.max(0, req.query.page - 1);
    const revenues = await YearlyRevenue.find()
      .limit(10)
      .skip(10 * page)
      .sort("desc");
    return res.status(200).send(revenues);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const searchRevenue = async (req, res) => {
  try {
    const year = { year: req.query.year && +req.query.year };
    const month = { month: req.query?.month };
    const product = { product: req.query?.product };
    const revenue_type = { revenue_type: req.query?.revenue_type };
    const query = [];
    if (!!req.query.year) {
      query.push(year);
    }
    if (!!req.query.month) {
      query.push(month);
    }
    if (!!req.query.product) {
      query.push(product);
    }
    if (!!req.query.revenue_type) {
      query.push(revenue_type);
    }
    const page = Math.max(0, req.query.page - 1);
    const revenues = await YearlyRevenue.find({ $and: query })
      .limit(10)
      .skip(10 * page)
      .sort("desc");
    return res.status(200).send(revenues);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = {
  addRevenue,
  getRevenue,
  searchRevenue,
};
