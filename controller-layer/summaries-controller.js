const express = require("express");
const errorHelper = require("../helpers/errors-helper");
const summariesLogic = require("../business-logic-layer/summaries-logic");

const router = express.Router();

router.post("/get-summaries-yearly", async (request, response) => {
    try {
        let { year } = request.body;
        const reportData = await summariesLogic.getAllSummariesByYear(year);
        response.json(reportData);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

module.exports = router;