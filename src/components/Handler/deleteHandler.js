const ApiError = require("../../utils/Error/ApiError");
const asyncHandling = require("express-async-handler");

exports.deleteHandling = (modelName) => {
  return asyncHandling(async (req, res, next) => {
    const { id } = req.params;
    const document = await modelName.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`not Found Document for this id ${id}`, 404));
    }
    // Trigger "deleteOne" event when update document
    document.deleteOne();
    res.status(204).send();
  });
};
