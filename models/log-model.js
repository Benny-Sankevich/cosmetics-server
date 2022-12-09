const mongoose = require("mongoose");

const LogSchema = mongoose.Schema({
    ip: {
        type: String,
        required: [true, "Missing ip."],
    },
    user: {
        type: String,
    },
    action: {
        type: String,
        required: [true, "Missing action."],
    },
    dateTime: {
        type: Date,
        default: Date.now(),
    },
},
    {
        versionKey: false,
        id: false
    });

const LogModel = mongoose.model("LogModel", LogSchema, "logs");

module.exports = LogModel;