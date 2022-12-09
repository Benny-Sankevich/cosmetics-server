require("../data-access-layer/dal");
const AppointmentModel = require("../models/appointments/appointment-model");
const summariesLogic = require("./summaries-logic");
const helpers = require("../helpers/helpers");

function getAllAppointmentsTodayAsync() {
    return getAppointmentsBetweenDatesAsync(helpers.getToday(), helpers.getTomorrow());
}

function getMonthlyAppointmentsAsync(date) {
    return getAppointmentsBetweenDatesAsync(getPreviousMonth(date), getNextMonth(date));
}

function getPreviousMonth(dateStr) {
    const date = new Date(dateStr);
    return new Date(date.getFullYear(), date.getMonth() - 1, 23, 00, 00, 00);
}

function getNextMonth(dateStr) {
    const date = new Date(dateStr);
    return new Date(date.getFullYear(), date.getMonth() + 1, 8, 00, 00, 00);
}

function getAppointmentsBetweenDatesAsync(fromDate, toDate) {
    return AppointmentModel.find({
        $and: [{ isActive: true }, {
            dateTimeStart: {
                $gte: fromDate,
                $lt: toDate
            }
        }]
    }).populate('user', ['_id', 'firstName', 'lastName', 'email', 'phoneNumber']).populate('treatment', ['_id', 'name']).exec();
}

function getAllAppointmentsByUserAsync(userId) {
    return AppointmentModel.find({
        $and: [{ userId }, { isActive: true }, {
            dateTimeStart: {
                $gte: helpers.getToday(),
            }
        }]
    }).populate('treatment', ['_id', 'name']).sort({ dateTimeStart: 1 }).exec();
}

function getAllAppointmentsAwaitingApprovalAsync() {
    return AppointmentModel.find({ $and: [{ isConfirmed: false }, { isActive: true }] }).populate('user', ['_id', 'firstName', 'lastName', 'email', 'phoneNumber']).populate('treatment', ['_id', 'name']).exec();
}

function getAppointmentByIdAsync(_id) {
    return AppointmentModel.findById(_id).populate('user', ['_id', 'firstName', 'lastName', 'email', 'phoneNumber']).populate('treatment', ['_id', 'name']).exec();
}

function getAllAppointmentsByTreatmentId(treatmentId) {
    return AppointmentModel.find({ treatmentId }).exec();
}

async function addAppointmentAsync(appointment) {
    appointment.createdDate = helpers.getDateTimeNow();
    const addedAppointment = await appointment.save();
    updateAppointmentSummaries(addedAppointment.dateTimeStart.getFullYear(), addedAppointment.dateTimeStart.getMonth() + 1, addedAppointment.treatmentId);
    return await getAppointmentByIdAsync(addedAppointment._id);
}

async function updateAppointmentAsync(appointment) {
    appointment.lastModified = helpers.getDateTimeNow();
    const appointmentUpdated = await AppointmentModel.findByIdAndUpdate(appointment._id, appointment, { returnOriginal: false }).exec();
    if (appointmentUpdated) {
        updateAppointmentSummaries(appointmentUpdated.dateTimeStart.getFullYear(), appointmentUpdated.dateTimeStart.getMonth() + 1, appointmentUpdated.treatmentId);
        return getAppointmentByIdAsync(appointmentUpdated._id);
    }
    return null;
}

async function updateAppointmentsBackgroundColorAsync(treatmentId, color) {
    let appointmentsList = await getAllAppointmentsByTreatmentId(treatmentId);
    if (appointmentsList.length > 0) {
        appointmentsList.forEach(async appointment => {
            await updateAppointmentBgColorAsync(appointment._id, { bgColor: color });
        });
    }
}

function updateAppointmentBgColorAsync(appointmentId, bgColor) {
    return AppointmentModel.findByIdAndUpdate(appointmentId, bgColor, { returnOriginal: false }).exec();
}

async function deleteAppointmentAsync(appointment) {
    appointment.isActive = false;
    return await updateAppointmentAsync(appointment);
}

async function getSumOfOrdersBetweenDatesAsync(fromTime, toTime, condition) {
    const sumOfOrdersArr = await AppointmentModel.find({
        $and: [{ isActive: true }, condition, {
            dateTimeStart: {
                $gte: fromTime,
                $lt: toTime
            }
        }]
    }).select("price").exec();
    return helpers.calculateSumOfArray(sumOfOrdersArr);
}

async function updateAppointmentSummaries(year, month, treatmentId) {
    const monthlySummary = await getSumOfOrdersBetweenDatesAsync(`${year}-${month}-01`, `${year}-${month}-31`, { treatmentId: treatmentId });
    await summariesLogic.updateSummariesData(null, treatmentId, year, month, monthlySummary);
    await updateOrdersSummaries(year, month);
}

async function updateOrdersSummaries(year, month) {
    const monthlySummary = await getSumOfOrdersBetweenDatesAsync(`${year}-${month}-01`, `${year}-${month}-31`, {});
    await summariesLogic.updateSummariesData('orders', null, year, month, monthlySummary);
}

async function approveAwaitingAppointmentAsync(appointments) {
    const appointmentsApproved = [];
    for (const item of appointments) {
        item.isConfirmed = true;
        const appointmentUpdated = await updateAppointmentAsync(item);
        appointmentsApproved.push(appointmentUpdated)
    }
    return appointmentsApproved;
}

function checkAppointmentsBetweenRangeAsync(rangeStart, rangeEnd) {
    // need to fix if the range start or end with another meeting
    return AppointmentModel.find({
        $or: [{
            dateTimeStart: {
                $gte: rangeStart,
                $lt: rangeEnd
            }
        }, {
            dateTimeEnd: {
                $gte: rangeStart,
                $lt: rangeEnd
            }
        }]
    }).and({ isActive: true }).exec();
}

module.exports = {
    getMonthlyAppointmentsAsync,
    getAllAppointmentsTodayAsync,
    getAllAppointmentsByUserAsync,
    addAppointmentAsync,
    updateAppointmentAsync,
    updateAppointmentsBackgroundColorAsync,
    deleteAppointmentAsync,
    getSumOfOrdersBetweenDatesAsync,
    getAllAppointmentsAwaitingApprovalAsync,
    approveAwaitingAppointmentAsync,
    checkAppointmentsBetweenRangeAsync
}