require("../data-access-layer/dal");
const ProductModel = require("../models/purchase/product-model");
const helpers = require("../helpers/helpers");

function getAllProductsAsync() {
    return ProductModel.find({ isActive: true }).exec();
}

function addProductAsync(product) {
    product.createdDate = helpers.getDateTimeNow();
    return product.save();
}

function updateProductAsync(product) {
    product.lastModified = helpers.getDateTimeNow();
    return ProductModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec();
}

async function deleteProductAsync(product) {
    product.isActive = false;
    return await updateProductAsync(product);
}
module.exports = {
    getAllProductsAsync,
    addProductAsync,
    updateProductAsync,
    deleteProductAsync
}