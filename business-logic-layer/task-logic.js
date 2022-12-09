require("../data-access-layer/dal");
const TaskModel = require("../models/task-model");
const helpers = require("../helpers/helpers");

function getAllTasksAsync() {
    return TaskModel.find({ isActive: true }).exec();
}

function addTaskAsync(task) {
    task.createdDate = helpers.getDateTimeNow();
    return task.save();
}

function updateTaskAsync(task) {
    task.lastModified = helpers.getDateTimeNow();
    return TaskModel.findByIdAndUpdate(task._id, task, { returnOriginal: false }).exec();
}

async function deleteTaskAsync(task) {
    task.isActive = false;
    return await updateTaskAsync(task);
}
module.exports = {
   getAllTasksAsync,
   addTaskAsync,
   updateTaskAsync,
   deleteTaskAsync
}