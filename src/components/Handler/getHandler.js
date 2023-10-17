const ApiError = require("../../utils/Error/ApiError");
const asyncHandling = require("express-async-handler");
const ApiFeatures = require("../../utils/features/ApiFeatures");

exports.getSpecificHandler = (modelName, populationOpt) => {
  return asyncHandling(async (req, res, next) => {
    // 1- build query
    let query = modelName.findById(req.params.id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    // 2- Execute query
    const getDoc = await query;
    if (!getDoc) {
      return next(
        new ApiError(`not Found Document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: getDoc });
  });
};

exports.getAllHandler = (modelName, Product = "") => {
  return asyncHandling(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    //  building query
    const countDocuments = await modelName.countDocuments();
    const features = new ApiFeatures(modelName.find(filter), req.query)
      .fields()
      .filter()
      .pagination(countDocuments)
      .search(Product)
      .sort();
    // Execute Query
    const { mongooseQuery, paginationResult } = features;
    const documents = await mongooseQuery;
    if (!documents) {
      return next(new ApiError("not Found Documents", 404));
    }
    res.status(200).json({
      success: true,
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });
};
