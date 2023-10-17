const Product = require("./product.model");
const { deleteHandling } = require("../Handler/deleteHandler");
const { updateHandler } = require("../Handler/updateHandler");
const { createHandler } = require("../Handler/createHandler");
const { getSpecificHandler, getAllHandler } = require("../Handler/getHandler");
const { uploadMultiImages } = require("../../middleware/uploadImage");
const asyncHandling = require("express-async-handler");
const sharp = require("sharp");

//upload images
const uploadImage = uploadMultiImages("imageCover", "images");

// resize Images
const resizeMultiImages = asyncHandling(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${Date.now()}-${
      Math.random() * 1000
    }-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imagesName = `product-${Date.now()}-${Math.random() * 1000}-${
          index + 1
        }.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imagesName}`);

        req.body.images.push(imagesName);
      })
    );
  }
  next();
});
//@desc   Create Product
//@route  Post /api/v1/Product
//@access Privet
const addProduct = createHandler(Product);
//@desc   Get All Categories
//@route  Get /api/v1/Product
//@access Public
const getAllProduct = getAllHandler(Product, "Product");
//@desc   Get Specific Product
//@route  Get /api/v1/Product/:id
//@access Public
const getSpecificProduct = getSpecificHandler(Product, "reviews");
//@desc   Update Specific Product
//@route  Put /api/v1/Product/:id
//@access Privet
const updateProduct = updateHandler(Product);

//@desc   Delete Specific Product
//@route  Delete /api/v1/Product/:id
//@access Privet
const deleteProduct = deleteHandling(Product);
module.exports = {
  addProduct,
  getAllProduct,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
  resizeMultiImages,
  uploadImage,
};
