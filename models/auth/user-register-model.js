const mongoose = require("mongoose");

const AuthRegisterSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Missing First Name."],
        minLength: [2, "First name must be minimum 2 chars."],
        maxLength: [20, "First name can`t exceed 20 chars."],
        match: [/^[A-Zא-ת].*$/, "First name  must start with a capital letter."]
    },
    lastName: {
        type: String,
        required: [true, "Missing Last Name."],
        minLength: [2, "Last name must be minimum 2 chars."],
        maxLength: [20, "Last name can`t exceed 20 chars."],
        match: [/^[A-Zא-ת].*$/, "Last name must start with a capital letter."]
    },
    email: {
        type: String,
        required: [true, "Missing Email."],
        unique: [true, "Email already exist."],
        match: [/^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/, "Email must be valid."]
    },
    password: {
        type: String,
        required: [true, "Missing Password."],
        minLength: [8, "Password must be minimum 8 chars."],
        maxLength: [5000, "Password can`t exceed 5000 chars."]
    },
    phoneNumber: {
        type: String,
        required: [true, "Missing phone number."],
        match: [/\d{3}-\d{7}/, "Phone number must be 10 digits."]
    },
    isAdmin: {
        type: String,
    },
    imageName: {
        type: String,
        default: 'default-image.jpg'
    },
    isActive: {
        type: Boolean,
    },
    createdDate: {
        type: String,
    },
    lastModified: {
        type: String,
    },
    lastLogin: {
        type: String,
    },
    token: {
        type: String,
    },
},
    {
        versionKey: false,
        id: false
    });

const UserRegisterModel = mongoose.model("UserRegisterModel", AuthRegisterSchema, "users");

module.exports = UserRegisterModel;