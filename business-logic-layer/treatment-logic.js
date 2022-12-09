require("../data-access-layer/dal");
const TreatmentModel = require("../models/treatment-model");
const summariesLogic = require("./summaries-logic");
const appointmentLogic = require("./appointment-logic");
const helpers = require("../helpers/helpers");

function getAllTreatmentsAsync() {
    return TreatmentModel.find({ isActive: true }).exec();
}

function getCustomersTreatmentsAsync() {
    return TreatmentModel.find({ $and: [{ isForReportsAndCustomers: true }, { isActive: true }] }).exec();
}

function getTreatmentByIdAsync(_id) {
    return TreatmentModel.findById(_id).exec();
}

function addTreatmentAsync(treatment) {
    treatment.price = getTreatmentPrice(treatment);
    treatment.createdDate = helpers.getDateTimeNow();
    return treatment.save();
}

function updateTreatmentAsync(treatment) {
    treatment.price = getTreatmentPrice(treatment);
    treatment.lastModified = helpers.getDateTimeNow();
    summariesLogic.updateSummaryBgColorAndToShowAsync(treatment._id, treatment.backgroundColor, treatment.isForReportsAndCustomers);
    appointmentLogic.updateAppointmentsBackgroundColorAsync(treatment._id, treatment.bgColor)
    return TreatmentModel.findByIdAndUpdate(treatment._id, treatment, { returnOriginal: false }).exec();
}

async function deleteTreatmentAsync(treatment) {
    treatment.isActive = false;
    return await updateTreatmentAsync(treatment);
}

function getTreatmentPrice(treatment) {
    return treatment.isForReportsAndCustomers ? treatment.price : 0;
}

module.exports = {
    getAllTreatmentsAsync,
    getCustomersTreatmentsAsync,
    getTreatmentByIdAsync,
    addTreatmentAsync,
    updateTreatmentAsync,
    deleteTreatmentAsync
}