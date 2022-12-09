const mongoose = require("mongoose");

const PurchaseOrderSchema = mongoose.Schema({
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing supplier."],
        ref: "SupplierModel"
    },
    orderDate: {
        type: Date,
        required: [true, "Missing purchase order date."],
    },
    orderNumber: {
        type: String,
    },
    totalPrice: {
        type: Number,
        default: 0,
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
    isConfirmed: {
        type: Boolean,
        default: false
    },
},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });

PurchaseOrderSchema.virtual("supplier", {
    ref: "SupplierModel",
    localField: "supplierId",
    foreignField: "_id",
    justOne: true
});
PurchaseOrderSchema.virtual("items", {
    ref: "PurchaseItemModel",
    localField: "_id",
    foreignField: "purchaseOrderId"
});

const PurchaseOrderModel = mongoose.model("PurchaseOrderModel", PurchaseOrderSchema, "purchase");

module.exports = PurchaseOrderModel;