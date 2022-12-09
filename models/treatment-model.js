const mongoose = require("mongoose");

const TreatmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Missing treatment name."],
        minLength: [2, "Treatment name must be minimum 2 chars."],
        maxLength: [20, "Treatment name can`t exceed 50 chars."],
        match: [/^[A-Zא-ת].*$/, "Treatment name must start with a capital letter."]
    },
    price: {
        type: Number,
        required: [true, "Missing price."],
        min: [0, "Price can`t be negative."],
    },
    duration: {
        type: String,
        required: [true, "Missing treatment duration."],
        minLength: [2, "Treatment duration must be minimum 2 chars."],
        maxLength: [20, "Treatment duration can`t exceed 50 chars."],
        match: [/^[A-Zא-ת].*$/, "Treatment duration must start with a capital letter."]
    },
    bgColor: {
        type: String,
        required: [true, "Missing bgColor."],
    },
    backgroundColor: {
        type: String,
        required: [true, "Missing backgroundColor."],
    },
    isForReportsAndCustomers: {
        type: Boolean,
        required: [true, "Missing backgroundColor."],
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

const TreatmentModel = mongoose.model("TreatmentModel", TreatmentSchema, "treatments");

module.exports = TreatmentModel;