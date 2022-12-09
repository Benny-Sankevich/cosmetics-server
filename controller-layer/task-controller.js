const express = require("express");
const taskLogic = require("../business-logic-layer/task-logic");
const TaskModel = require("../models/task-model");
const errorHelper = require("../helpers/errors-helper");
const verifyIsAdmin = require("../middleware/verify-isAdmin");

const router = express.Router();
router.use(verifyIsAdmin);

router.post("/get-all-tasks", async (request, response) => {
    try {
        const tasks = await taskLogic.getAllTasksAsync();
        response.json(tasks);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/add-task", async (request, response) => {
    try {
        const task = new TaskModel(request.body);
        const error = task.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const productAdded = await taskLogic.addTaskAsync(task);
        response.status(201).json(productAdded);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/update-task", async (request, response) => {
    try {
        const task = new TaskModel(request.body);
        const error = task.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const productUpdated = await taskLogic.updateTaskAsync(task);
        if (!productUpdated) return response.status(404).send(errorHelper.getError('task has not found please try again'));
        response.status(201).json(productUpdated);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/delete-task", async (request, response) => {
    try {
        const task = new TaskModel(request.body);
        const error = task.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        await taskLogic.deleteTaskAsync(task);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

module.exports = router;