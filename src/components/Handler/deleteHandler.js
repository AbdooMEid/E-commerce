const ApiError = require("../../utils/Error/ApiError");
const asyncHandling = require("express-async-handler");

exports.deleteHandling = (modelName) => {
  return asyncHandling(async (req, res, next) => {
    const { id } = req.params;
    const deleteDocument = await modelName.findByIdAndUpdate(id, {
      active: false,
    });
    !deleteDocument &&
      next(new ApiError(`not Found Document for this id ${id}`, 404));
    deleteDocument && res.status(204).send();
  });
};

// exports.deleteHandlingUser = (modelName) => {
//   return asyncHandling(async (req, res, next) => {
//     const { id } = req.params;
//     const deleteDocument = await modelName.findByIdAndUpdate(
//       id,
//       { active: req.body.active },
//       { new: true }
//     );
//     !deleteDocument &&
//       next(new ApiError(`not Found Document for this id ${id}`, 404));
//     deleteDocument && res.status(200).send({ deleteDocument });
//   });
// };
