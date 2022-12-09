require("../data-access-layer/dal");
const SupplierModel = require("../models/purchase/supplier-model");
const helpers = require("../helpers/helpers");

function getAllSuppliersAsync() {
    return SupplierModel.find({ isActive: true }).exec();
}

function addSupplierAsync(supplier) {
    supplier.createdDate = helpers.getDateTimeNow();
    return supplier.save();
}

function updateSupplierAsync(supplier) {
    supplier.lastModified = helpers.getDateTimeNow();
    return SupplierModel.findByIdAndUpdate(supplier._id, supplier, { returnOriginal: false }).exec();
}

async function deleteSupplierAsync(supplier) {
    supplier.isActive = false;
    return await updateSupplierAsync(supplier);
}

module.exports = {
    getAllSuppliersAsync,
    addSupplierAsync,
    updateSupplierAsync,
    deleteSupplierAsync
}