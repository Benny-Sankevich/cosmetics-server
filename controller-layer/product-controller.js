const express = require("express");
const productLogic = require("../business-logic-layer/product-logic");
const ProductModel = require("../models/purchase/product-model");
const errorHelper = require("../helpers/errors-helper");
const verifyIsAdmin = require("../middleware/verify-isAdmin");

const router = express.Router();
router.use(verifyIsAdmin);

router.post("/get-all-products", async (request, response) => {
    try {
        const products = await productLogic.getAllProductsAsync();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/add-product", async (request, response) => {
    try {
        const product = new ProductModel(request.body);
        const error = product.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const productAdded = await productLogic.addProductAsync(product);
        response.status(201).json(productAdded);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/update-product", async (request, response) => {
    try {
        const product = new ProductModel(request.body);
        const error = product.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const productUpdated = await productLogic.updateProductAsync(product);
        if (!productUpdated) return response.status(404).send(errorHelper.getError('Product has not found please try again'));
        response.status(201).json(productUpdated);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/delete-product", async (request, response) => {
    try {
        const product = new ProductModel(request.body);
        const error = product.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        await productLogic.deleteProductAsync(product);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

module.exports = router;