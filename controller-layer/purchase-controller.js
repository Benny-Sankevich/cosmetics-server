const express = require("express");
const purchaseOrderLogic = require("../business-logic-layer/purchase-order-logic");
const purchaseItemLogic = require("../business-logic-layer/purchase-item-logic");
const PurchaseOrderModel = require("../models/purchase/purchase-order-model");
const PurchaseItemModel = require("../models/purchase/purchase-item-model");
const errorHelper = require("../helpers/errors-helper");
const verifyIsAdmin = require("../middleware/verify-isAdmin");

const router = express.Router();
router.use(verifyIsAdmin);

// ---- purchase order ----
router.post("/get-all-orders", async (request, response) => {
    try {
        const purchaseOrders = await purchaseOrderLogic.getAllPurchaseOrdersAsync();
        response.json(purchaseOrders);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/get-sum-between-date", async (request, response) => {
    try {
        const date = request.body;
        const purchaseOrdersSum = await purchaseOrderLogic.getSumOfPurchaseOrdersBetweenDatesAsync(date.fromTime, date.toTime, {});
        response.json(purchaseOrdersSum);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/add-purchase-order", async (request, response) => {
    try {
        const purchaseOrder = new PurchaseOrderModel(request.body);
        const error = purchaseOrder.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const purchaseOrderAdded = await purchaseOrderLogic.addPurchaseOrderAsync(purchaseOrder);
        response.status(201).json(purchaseOrderAdded);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/update-purchase-order", async (request, response) => {
    try {
        const purchaseOrder = new PurchaseOrderModel(request.body);
        const error = purchaseOrder.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const purchaseOrderUpdated = await purchaseOrderLogic.updatePurchaseOrderAsync(purchaseOrder);
        if (!purchaseOrderUpdated) return response.status(404).send(errorHelper.getError('Purchase order has not found please try again'));
        response.status(201).json(purchaseOrderUpdated);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/delete-purchase-order", async (request, response) => {
    try {
        const purchaseOrder = new PurchaseOrderModel(request.body);
        const error = purchaseOrder.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        await purchaseOrderLogic.deletePurchaseOrderAsync(purchaseOrder);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

// ---- purchase item ----
router.post("/get-items-by-orderId", async (request, response) => {
    try {
        const { purchaseOrderId } = request.body;
        const orderItems = await purchaseItemLogic.getAllItemsPerOrderIdAsync(purchaseOrderId);
        response.json(orderItems);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/add-purchase-item", async (request, response) => {
    try {
        const purchaseItem = new PurchaseItemModel(request.body);
        const error = purchaseItem.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const purchaseItemAdded = await purchaseItemLogic.addPurchaseItemAsync(purchaseItem);
        response.status(201).json(purchaseItemAdded);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/update-purchase-item", async (request, response) => {
    try {
        const purchaseItem = new PurchaseItemModel(request.body);
        const error = purchaseItem.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const purchaseItemUpdated = await purchaseItemLogic.updatePurchaseItemAsync(purchaseItem);
        if (!purchaseItemUpdated) return response.status(404).send('Item has not found please try again');
        response.status(201).json(purchaseItemUpdated);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/delete-purchase-item", async (request, response) => {
    try {
        const purchaseItem = new PurchaseItemModel(request.body);
        const error = purchaseItem.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        await purchaseItemLogic.deletePurchaseItemAsync(purchaseItem);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

module.exports = router;