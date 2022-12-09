const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing user ID."],
        ref: "UserRegisterModel"
    },
    treatmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing product id."],
        ref: "ProductModel"
    },
    dateTimeStart: {
        type: Date,
        required: [true, "Missing start appointment date time."],
    },
    dateTimeEnd: {
        type: Date,
        required: [true, "Missing end appointment date time."],
    },
    note: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, "Missing price."],
        min: [0, "Price can`t be negative."],
    },
    bgColor: {
        type: String,
        required: [true, "Missing bgColor."],
    },
    allDay: {
        type: Boolean,
        required: [true, "Missing allDay."],
    },
    createdDate: {
        type: String,
    },
    lastModified: {
        type: String,
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });

AppointmentSchema.virtual("user", {
    ref: "UserRegisterModel",
    localField: "userId",
    foreignField: "_id",
    justOne: true
});
AppointmentSchema.virtual("treatment", {
    ref: "TreatmentModel",
    localField: "treatmentId",
    foreignField: "_id",
    justOne: true
});

const AppointmentModel = mongoose.model("AppointmentModel", AppointmentSchema, "appointments");

module.exports = AppointmentModel;