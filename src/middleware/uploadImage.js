const multer = require("multer");
const ApiError = require("../utils/Error/ApiError");

const multerOptions = () => {
  const storage = multer.memoryStorage();
  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Image Only Allowed", 400), false);
    }
  };
  const upload = multer({ storage, fileFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

exports.uploadMultiImages = (filedNameCover, filedNameImages) => {
  return multerOptions().fields([
    { name: filedNameCover, maxCount: 1 },
    { name: filedNameImages, maxCount: 4 },
  ]);
};
