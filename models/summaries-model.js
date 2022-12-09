const mongoose = require("mongoose");

const SummariesSchema = mongoose.Schema({
    dataType: {
        type: String,
        required: [true, "Missing data type"],

    },
    type: {
        type: String,
        required: [true, "Missing type"],
    },
    label: {
        type: String,
        required: [true, "Missing label"],
    },
    treatmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TreatmentModel"
    },
    year: {
        type: Number,
        required: [true, "Missing year"],
    },
    data: {
        type: Array,
        required: [true, "Missing data"],
    },
    borderWidth: {
        type: Number,
    },
    borderColor: {
        type: String,
    },
    backgroundColor: {
        type: String,
        required: [true, "Missing module name."],
    },
    stack: {
        type: String,
    },
    fill: {
        type: Boolean,
    },
    toShow: {
        type: Boolean,
    }
},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });
SummariesSchema.virtual("treatment", {
    ref: "TreatmentModel",
    localField: "treatmentId",
    foreignField: "_id",
    justOne: true
});
const SummariesModel = mongoose.model("SummariesModel", SummariesSchema, "summaries");

module.exports = SummariesModel;