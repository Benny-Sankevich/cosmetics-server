const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Missing title."],
    },
    message: {
        type: String,
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
    isCompleted: {
        type: Boolean,
        default: false
    },
},
    {
        versionKey: false,
        id: false
    });

const TaskModel = mongoose.model("TaskModel", TaskSchema, "tasks");

module.exports = TaskModel;