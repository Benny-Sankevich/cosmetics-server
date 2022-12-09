require("../data-access-layer/dal");
const PurchaseOrderModel = require("../models/purchase/purchase-order-model");
const summariesLogic = require("./summaries-logic");
const helpers = require("../helpers/helpers");

function getAllPurchaseOrdersAsync() {
    return PurchaseOrderModel.find({ isActive: true }).populate("supplier").exec();
}

function getPurchaseOrderAsync(_id) {
    return PurchaseOrderModel.findById(_id).populate("supplier").exec();
}

function getCountPurchaseOrderAsync() {
    return PurchaseOrderModel.countDocuments().exec();
}

async function addPurchaseOrderAsync(purchaseOrder) {
    purchaseOrder.orderNumber = await createNewOrderNumberAsync(purchaseOrder)
    purchaseOrder.createdDate = helpers.getDateTimeNow();
    return purchaseOrder.save();
}

async function createNewOrderNumberAsync(purchaseOrder) {
    const ordersCount = await getCountPurchaseOrderAsync();
    return `PO${purchaseOrder.orderDate.getFullYear()}0${ordersCount + 1}`;
}

async function updatePurchaseOrderAsync(purchaseOrder) {
    purchaseOrder.lastModified = helpers.getDateTimeNow();
    const purchaseOrderUpdated = await PurchaseOrderModel.findByIdAndUpdate(purchaseOrder._id, purchaseOrder, { returnOriginal: false }).exec();
    if (purchaseOrderUpdated) {
        updateSummaries(purchaseOrderUpdated.orderDate.getFullYear(), purchaseOrderUpdated.orderDate.getMonth() + 1)
        return await getPurchaseOrderAsync(purchaseOrderUpdated._id);;
    }
    return null;
}

async function deletePurchaseOrderAsync(purchaseOrder) {
    purchaseOrder.isActive = false;
    return await updatePurchaseOrderAsync(purchaseOrder);
}

async function getSumOfPurchaseOrdersBetweenDatesAsync(fromTime, toTime) {
    const purchaseOrders = await PurchaseOrderModel.find({
        $and: [{ isActive: true }, {
            orderDate: {
                $gte: fromTime,
                $lt: toTime
            }
        }]
    }).select("totalPrice").exec();
    return helpers.calculateTotalPriceOfArray(purchaseOrders);
}

async function updateSummaries(year, month) {
    const monthlySummary = await getSumOfPurchaseOrdersBetweenDatesAsync(`${year}-${month-1}-31`, `${year}-${month+1}-01`);
    summariesLogic.updateSummariesData('purchaseOrders', null, year, month, monthlySummary)
}

module.exports = {
    getAllPurchaseOrdersAsync,
    addPurchaseOrderAsync,
    updatePurchaseOrderAsync,
    deletePurchaseOrderAsync,
    getSumOfPurchaseOrdersBetweenDatesAsync
}