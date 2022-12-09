const express = require("express");
const errorHelper = require("../helpers/errors-helper");
const reportsLogic = require("../business-logic-layer/reports-logic");
const ReportModel = require("../models/report-model");
const verifyIsAdmin = require("../middleware/verify-isAdmin");

const router = express.Router();
router.use(verifyIsAdmin);

router.post("/get-report-list", async (request, response) => {
    try {
        const reports = await reportsLogic.getReportsListAsync();
        response.json(reports);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/get-report-data", async (request, response) => {
    try {
        const reportParameters = request.body;
        const reportData = await reportsLogic.getReportDataAsync(reportParameters._id, reportParameters.year);
        if (!reportData) return response.status(404).send(errorHelper.getError('Report has not found please try again'));
        response.json(reportData);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/add-report", async (request, response) => {
    try {
        const report = new ReportModel(request.body);
        const error = report.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const reportAdded = await reportsLogic.addReportAsync(report);
        response.status(201).json(reportAdded);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

module.exports = router;