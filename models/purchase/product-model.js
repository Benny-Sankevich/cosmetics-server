const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Missing product name."],
        minLength: [3, "Product name must be minimum 3 chars."],
        maxLength: [20, "Product name can`t exceed 20 chars."],
        match: [/^[A-Zא-ת].*$/, "Product name  must start with a capital letter."]
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
        id: false
    });

const ProductModel = mongoose.model("ProductModel", ProductSchema, "products");

module.exports = ProductModel;