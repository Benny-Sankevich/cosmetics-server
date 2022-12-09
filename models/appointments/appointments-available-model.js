const mongoose = require("mongoose");

const AppointmentAvailableSchema = mongoose.Schema({
    dateTimeStart: {
        type: Date,
        required: [true, "Missing start appointment date time."],
    },
    dateTimeEnd: {
        type: Date,
        required: [true, "Missing end appointment date time."],
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

const AppointmentAvailableModel = mongoose.model("AppointmentAvailableModel", AppointmentAvailableSchema, "appointmentAvailable");

module.exports = AppointmentAvailableModel;