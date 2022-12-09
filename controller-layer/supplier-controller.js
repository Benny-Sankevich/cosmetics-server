const express = require("express");
const supplierLogic = require("../business-logic-layer/supplier-logic");
const SupplierModel = require("../models/purchase/supplier-model");
const errorHelper = require("../helpers/errors-helper");
const verifyIsAdmin = require("../middleware/verify-isAdmin");

const router = express.Router();
router.use(verifyIsAdmin);

router.post("/get-suppliers", verifyIsAdmin, async (request, response) => {
    try {
        const suppliers = await supplierLogic.getAllSuppliersAsync();
        response.json(suppliers);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/add-supplier", async (request, response) => {
    try {
        const supplier = new SupplierModel(request.body);
        const error = supplier.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const supplierAdded = await supplierLogic.addSupplierAsync(supplier);
        response.status(201).json(supplierAdded);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/update-supplier", async (request, response) => {
    try {
        const supplier = new SupplierModel(request.body);
        const error = supplier.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const supplierUpdated = await supplierLogic.updateSupplierAsync(supplier);
        if (!supplierUpdated) return response.status(404).send(errorHelper.getError('Supplier has not found please try again'));
        response.status(201).json(supplierUpdated);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/delete-supplier", async (request, response) => {
    try {
        const supplier = new SupplierModel(request.body);
        const error = supplier.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        await supplierLogic.deleteSupplierAsync(supplier);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

module.exports = router;