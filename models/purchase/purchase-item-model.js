const mongoose = require("mongoose");

const PurchaseItemSchema = mongoose.Schema({
    purchaseOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing purchase order id."],
        ref: "PurchaseOrderModel"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing product id."],
        ref: "ProductModel"
    },
    amount: {
        type: Number,
        required: [true, "Missing amount."],
        min: [1, "Amount must be minimum one."],
    },
    price: {
        type: Number,
        required: [true, "Missing price."],
        min: [0, "Price can`t be negative."],
    },
    totalPrice: {
        type: Number,
    },
    createdDate: {
        type: String,
    },
    lastModified: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });

PurchaseItemSchema.virtual("product", {
    ref: "ProductModel",
    localField: "productId",
    foreignField: "_id",
    justOne: true
});

const PurchaseItemModel = mongoose.model("PurchaseItemModel", PurchaseItemSchema, "items");

module.exports = PurchaseItemModel;