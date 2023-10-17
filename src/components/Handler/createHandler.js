const asyncHandling = require("express-async-handler");

exports.createHandler = (modelName) => {
  return asyncHandling(async (req, res) => {
    // if (modelName === "Review") {
    //   req.body.user = req.user._id;
    //   req.body.product = req.params.product;
    // }
    const addDocument = new modelName(req.body);
    await addDocument.save();
    res.status(200).json({ success: true, data: addDocument });
  });
};
