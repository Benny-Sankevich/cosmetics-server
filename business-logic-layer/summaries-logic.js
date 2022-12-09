require("../data-access-layer/dal");
const SummariesModel = require("../models/summaries-model");
const treatmentLogic = require("./treatment-logic");
const helpers = require("../helpers/helpers");

function getAllSummariesByYear(year) {
    return SummariesModel.find({ $and: [{ year }, { toShow: true }] }).exec()
}

function getSummaryByYear(year, condition) {
    return SummariesModel.findOne({ $and: [{ year }, condition] }).exec();
}

function getSummaryByDataType(dataType) {
    return SummariesModel.findOne({ dataType }).exec();
}

function getAllSummariesByTreatmentId(treatmentId) {
    return SummariesModel.find({ treatmentId }).exec();
}

function getSummaryByDataTypeOrTreatmentIdAsync(parameter, year) {
    return SummariesModel.findOne({ $or: [{ dataType: parameter }, { label: parameter }] }).and({ year }).exec();
}

function addSummaries(summaries) {
    return summaries.save();
}

function updateSummaryDataAsync(summaryId, summaryData) {
    return SummariesModel.findByIdAndUpdate(summaryId, summaryData, { returnOriginal: false }).exec();
}

async function updateSummaryBgColorAndToShowAsync(treatmentId, color, toShow) {
    let summariesList = await getAllSummariesByTreatmentId(treatmentId);
    if (summariesList.length > 0) {
        summariesList.forEach(async summary => {
            await updateSummaryDataAsync(summary._id, { backgroundColor: color, toShow });
        });
    }
}

async function updateSummariesData(dataType, treatmentId, year, month, monthlySummary) {
    let condition = treatmentId ? { treatmentId } : { dataType };
    let existingSummary = await getSummaryByYear(year, condition);
    if (!existingSummary) {
        const newSummaries = await getDefaultSummariesData(dataType, year, treatmentId);
        existingSummary = await addSummaries(newSummaries);
    }
    existingSummary.data[month - 1] = monthlySummary;
    return await updateSummaryDataAsync(existingSummary._id, existingSummary);
}

function getDefaultSummariesData(dataType, year, treatmentId) {
    if (treatmentId) return getTreatmentSummaryData(year, treatmentId)
    return getSummaryData(dataType, year);
}

async function getTreatmentSummaryData(year, treatmentId) {
    const treatment = await treatmentLogic.getTreatmentByIdAsync(treatmentId);
    return getDefaultSummaries('treatment', 'bar', treatment.name, treatmentId, year, 1, null, treatment.backgroundColor, 'Stack 1', null, treatment.isForReportsAndCustomers);
}

async function getSummaryData(dataType, year) {
    const summary = await getSummaryByDataType(dataType);
    if (summary) {
        return getDefaultSummaries(dataType, summary.type, summary.label, null, year, null, summary.borderColor, summary.backgroundColor, null, false, summary.toShow);
    }
    const randomColor = helpers.getRandomColor();
    return getDefaultSummaries(dataType, 'line', dataType, null, year, null, randomColor, randomColor, null, false, true);

}

function getDefaultSummaries(dataType, type, label, treatmentId, year, borderWidth, borColor, bgColor, stack, fill, toShow) {
    return new SummariesModel({
        dataType,
        type,
        label,
        treatmentId,
        year,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderWidth: borderWidth ? borderWidth : undefined,
        borderColor: borColor ? borColor : undefined,
        backgroundColor: bgColor ? bgColor : helpers.getRandomColor(),
        stack: stack ? stack : undefined,
        fill: fill === false ? fill : undefined,
        toShow
    });
}

module.exports = {
    getAllSummariesByYear,
    updateSummariesData,
    getSummaryByDataTypeOrTreatmentIdAsync,
    updateSummaryBgColorAndToShowAsync
}