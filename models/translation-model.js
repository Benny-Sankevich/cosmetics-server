const mongoose = require("mongoose");

const TranslationSchema = mongoose.Schema({
    code: {
        type: String,
        required: [true, "Missing code."],
        minLength: [2, "Code must be minimum 2 chars."],
        maxLength: [40, "Code can`t exceed 40 chars."],
    },
    en: {
        type: String,
        required: [true, "Missing value."],
        minLength: [2, "Value must be minimum 2 chars."],
        maxLength: [50, "Value can`t exceed 50 chars."],
        match: [/^[A-Z].*$/, "Value  must start with a capital letter."]
    },
    he: {
        type: String,
        required: [true, "Missing value."],
        minLength: [2, "Value must be minimum 2 chars."],
        maxLength: [50, "Value can`t exceed 50 chars."],
        match: [/^[א-ת].*$/, "Value  must start with a capital letter."]
    },
    createdDate: {
        type: String,
    },
    lastModified: {
        type: String,
    },
},
    {
        versionKey: false,
        id: false
    });

const TranslationModel = mongoose.model("TranslationModel", TranslationSchema, "translations");

module.exports = TranslationModel;