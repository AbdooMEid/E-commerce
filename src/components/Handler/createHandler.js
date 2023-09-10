const asyncHandling = require("express-async-handler");

exports.createHandler = (modelName) => {
  return asyncHandling(async (req, res) => {
    const addDocument = new modelName(req.body);
    await addDocument.save();
    res.status(200).json({ success: true, data: addDocument });
  });
};
