const mongoose = require("mongoose");

const ResetPasswordSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Missing Email."],
        unique: [true, "Email already exist."],
        match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Email must be valid."]
    },
    password: {
        type: String,
        required: [true, "Missing Password."],
        minLength: [8, "Password must be minimum 8 chars."],
        maxLength: [5000, "Password can`t exceed 5000 chars."]
    },
    oldPassword: {
        type: String,
        required: [false],
        minLength: [8, "Old password must be minimum 8 chars."],
        maxLength: [5000, "Old password can`t exceed 5000 chars."]
    },
    lastModified: {
        type: String,
    },
},
    {
        versionKey: false,
        id: false
    });

const ResetPasswordModel = mongoose.model("ResetPasswordModel", ResetPasswordSchema, "users");

module.exports = ResetPasswordModel;