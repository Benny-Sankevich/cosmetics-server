const mongoose = require("mongoose");

const ColorsSchema = mongoose.Schema({
    color: {
        type: String,
        required: [true, "Missing colors."],
    },
},
    {
        versionKey: false,
        id: false
    });

const ColorsModel = mongoose.model("ColorsModel", ColorsSchema, "colors");

module.exports = ColorsModel;