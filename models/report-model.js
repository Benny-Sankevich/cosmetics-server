const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Missing title"],
        match: [/^[A-Zא-ת].*$/, "Title must start with a capital letter."]
    },
    description: {
        type: String,
        required: [true, "Missing description"],
        match: [/^[A-Zא-ת].*$/, "Description must start with a capital letter."]
    },
    key: {
        type: String,
        required: [true, "Missing key"],
    },
    isYearly: {
        type: Boolean,
        required: [true, "Missing isYearly"],
    },
    columns: {
        type: Array,
        required: [true, "Missing columns"],
    },
    parameters: {
        type: Array,
        required: [true, "Missing parameters"],
    },
    rows: {
        type: Array,
    },
    visibleColumns: {
        type: Array,
        required: [true, "Missing visibleColumns"],
    },
    letter: {
        type: String,
        required: [true, "Missing letter"],
        match: [/^[A-Z]{1}/, "Letter must one capital letter."]
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

const ReportModel = mongoose.model("ReportModel", ReportSchema, "reports");

module.exports = ReportModel;