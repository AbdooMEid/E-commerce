const ApiError = require("../../utils/Error/ApiError");
const { asyncHandling } = require("../../utils/Error/asyncHandler");

exports.deleteHandling = (modelName) => {
  return asyncHandling(async (req, res, next) => {
    const { id } = req.params;
    const deleteDocument = await modelName.findByIdAndDelete(id);
    !deleteDocument &&
      next(new ApiError(`not Found ${modelName} for this id ${id}`, 404));
    deleteDocument && res.status(204).send();
  });
};
