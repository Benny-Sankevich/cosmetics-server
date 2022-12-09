require("../data-access-layer/dal");
const PurchaseItemModel = require("../models/purchase/purchase-item-model");
const purchaseOrderLogic = require("./purchase-order-logic");
const helpers = require("../helpers/helpers");

function getAllItemsPerOrderIdAsync(purchaseOrderId) {
    return PurchaseItemModel.find({ $and: [{ purchaseOrderId }, { isActive: true }] }).populate('product').exec();
}

async function addPurchaseItemAsync(item) {
    item.createdDate = helpers.getDateTimeNow();
    item.totalPrice = await helpers.calculateTotalPriceOfItem(item);
    await item.save();
    calculateTotalPriceOfOrder(item.purchaseOrderId);
    return item;
}

async function updatePurchaseItemAsync(item) {
    item.lastModified = helpers.getDateTimeNow();
    item.totalPrice = await helpers.calculateTotalPriceOfItem(item);
    const itemUpdated = await PurchaseItemModel.findByIdAndUpdate(item._id, item, { returnOriginal: false }).exec();
    if (itemUpdated) {
        calculateTotalPriceOfOrder(item.purchaseOrderId);
        return itemUpdated;
    }
    return null;
}

async function deletePurchaseItemAsync(item) {
    item.isActive = false;
    return await updatePurchaseItemAsync(item);
}

async function calculateTotalPriceOfOrder(purchaseOrderId) {
    const totalPrice = await getSumOfAllItemsPerPurchaseOrderAsync(purchaseOrderId);
    purchaseOrderLogic.updatePurchaseOrderAsync({ _id: purchaseOrderId, totalPrice: totalPrice });
}

async function getSumOfAllItemsPerPurchaseOrderAsync(purchaseOrderId) {
    const purchaseItems = await PurchaseItemModel.find({ $and: [{ purchaseOrderId }, { isActive: true }] }).exec();
    return helpers.calculateTotalPriceOfArray(purchaseItems);
}

module.exports = {
    addPurchaseItemAsync,
    updatePurchaseItemAsync,
    deletePurchaseItemAsync,
    getAllItemsPerOrderIdAsync
}