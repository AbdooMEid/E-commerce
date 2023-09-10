const asyncHandling = require("express-async-handler");
const ApiError = require("../../utils/Error/ApiError");

exports.updateHandler = (modelName) => {
  return asyncHandling(async (req, res, next) => {
    const UpdateDocument = await modelName.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!UpdateDocument) {
      return next(
        new ApiError(
          `not Found ${!modelName || "Document"} for this id ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: UpdateDocument });
  });
};
