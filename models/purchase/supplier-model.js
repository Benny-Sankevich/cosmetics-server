const mongoose = require("mongoose");

const SupplierSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: [true, "Missing company name."],
        minLength: [3, "Company name must be minimum 3 chars."],
        maxLength: [20, "Company name can`t exceed 20 chars."],
        match: [/^[A-Zא-ת].*$/, "Company name  must start with a capital letter."]
    },
    contact: {
        type: String,
        minLength: [3, "Contact must be minimum 3 chars."],
        maxLength: [20, "Contact can`t exceed 20 chars."],
        match: [/^[A-Zא-ת].*$/, "Contact  must start with a capital letter."]
    },
    email: {
        type: String,
        minLength: [7, "Email must be minimum 7 chars."],
        maxLength: [50, "Email can`t exceed 50 chars."],
        match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Email must be valid."]
    },
    phoneNumber: {
        type: String,
        unique: [true, "Phone number already exist."],
        match: [/\d{3}-\d{7}/, "Phone number must be 9 or 10 digits."]
    },
    address: {
        type: String,
        minLength: [3, "Address must be minimum 3 chars."],
        maxLength: [20, "Address can`t exceed 20 chars."],
        match: [/^[A-Zא-ת].*$/, "Address must start with a capital letter."]
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

const SupplierModel = mongoose.model("SupplierModel", SupplierSchema, "suppliers");

module.exports = SupplierModel;