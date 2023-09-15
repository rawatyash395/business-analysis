const { YearlyRevenue } = require("../models/yearlyRevenueSchema");
const revenueData = require("../assets/revenue_data_new.json");

const addRevenue = async (req, res) => {
  try {
    await YearlyRevenue.insertMany(revenueData);
    return res.status(201).json({
      message: "Yearly revenue added successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const getRevenue = async (req, res) => {
  try {
    const sortType = req.query.sort === "desc" ? -1 : 1;
    const sortProperty = req.query.sortBy ? req.query.sortBy : "acv";
    const page = Math.max(0, req.query.page - 1);
    const revenues = await Promise.all([
      YearlyRevenue.find()
        .limit(10)
        .skip(10 * page)
        .sort({ [sortProperty]: sortType }),
      YearlyRevenue.find().count(),
    ]);
    return res.status(200).send({ data: revenues[0], total: revenues[1] });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const searchRevenue = async (req, res) => {
  try {
    const sort = req.query.sort ? req.query.sort : "-1";
    const orderby = req.query.orderby ? req.query.orderby : "acv";
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
    const revenues = await Promise.all([
      YearlyRevenue.find({ $and: query })
        .limit(10)
        .skip(10 * page)
        .sort({ [orderby]: sort }),
      YearlyRevenue.find().count({ $and: query }),
    ]);
    return res.status(200).send({ data: revenues[0], total: revenues[1] });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const getPivotChartData = async (req, res) => {
  try {
    let revenueType = req.query.revenueType ? req.query.revenueType : null;
    const sortType = req.query.sort === "desc" ? -1 : 1;
    const sortProperty = req.query.sortBy ? req.query.sortBy : "acv";
    const revenueTypesData = await YearlyRevenue.find().distinct(
      "revenue_type"
    );
    if (!revenueType) {
      revenueType = revenueTypesData.sort()[0];
    }
    let data = [];
    if (revenueType === "all") {
      data = await Promise.all([
        YearlyRevenue.find().sort({
          [sortProperty]: sortType,
        }),
        YearlyRevenue.count(),
      ]);
    } else {
      data = await Promise.all([
        YearlyRevenue.find({ revenue_type: revenueType }).sort({
          [sortProperty]: sortType,
        }),
        YearlyRevenue.count({ revenue_type: revenueType }),
      ]);
    }
    const finalRevenueData = formatRevenueData(data[0]);
    return res.status(200).send({
      revenueType: revenueTypesData.sort(),
      data: finalRevenueData,
      total: data[1],
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const formatRevenueData = (revenueData) => {
  const finalRevenueData = (revenueData || []).reduce((acc, item) => {
    if (!acc[item.product]) {
      acc[item.product] = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      };
      acc[item.product][item.month] = item.acv;
    } else {
      if (acc[item.product][item.month]) {
        acc[item.product][item.month] += item.acv;
      } else {
        acc[item.product][item.month] = item.acv;
      }
    }
    return acc;
  }, {});
  return finalRevenueData;
};

module.exports = {
  addRevenue,
  getRevenue,
  getPivotChartData,
  searchRevenue,
};
