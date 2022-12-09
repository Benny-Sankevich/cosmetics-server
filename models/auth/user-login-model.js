const mongoose = require("mongoose");

const AuthLoginSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Missing Email."],
        minLength: [7, "Email must be minimum 7 chars."],
        maxLength: [50, "Email can`t exceed 50 chars."],
        match: [/^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/, "Email must be valid."]
    },
    password: {
        type: String,
        required: [true, "Missing Password."],
        minLength: [8, "Password must be minimum 8 chars."],
        maxLength: [5000, "Password can`t exceed 5000 chars."]
    },
    token: {
        type: String,
    },
},
    {
        versionKey: false,
        id: false
    });

const UserLoginModel = mongoose.model("UserLoginModel", AuthLoginSchema, "users");

module.exports = UserLoginModel;